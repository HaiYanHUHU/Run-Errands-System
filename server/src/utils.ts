

import fs from 'fs';
import path from 'path';
import crypto, { Encoding } from 'crypto';
import { promisify } from 'util';
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const copyFile = promisify(fs.copyFile);
const rename = promisify(fs.rename);
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);

export function _ext(filename: string) {
  const tmp = path.extname(filename || '').split('.');
  return tmp.length > 1 ? tmp.pop() : '';
}

export async function _write(filepath: string, content: any) {
  const dir = path.dirname(filepath);
  const exist = await exists(dir);
  if (!exist) {
    await mkdir(dir, { recursive: true });
  }
  return await writeFile(filepath, content);
}

export async function _append(filepath: string, content: any) {
  await writeFile(filepath, content, { flag: 'a' });
}

export async function _read(filepath: string, charset: Encoding = 'utf8') {
  return await readFile(filepath, charset);
}

export async function _read_json(filepath: string, charset: Encoding = 'utf8') {
  const content = await readFile(path.resolve(filepath), charset);
  return JSON.parse(content);
}

export const _mkdir = async (dir: fs.PathLike) => {
  const exist = await exists(dir);
  if (!exist) {
    await mkdir(dir, { recursive: true });
  }
};

export async function _exists(filepath: fs.PathLike) {
  return await exists(filepath);
}

export async function _move(source: fs.PathLike, target: string) {
  if (await _exists(source)) {
    await _mkdir(path.dirname(target));
    await rename(source, target);
  }
}

export async function _is_file(filepath: fs.PathLike) {
  const status = await stat(filepath);
  return status.isFile();
}

export async function _is_dir(dirpath: fs.PathLike) {
  const status = await stat(dirpath);
  return status.isDirectory();
}

export async function _copy(source: string, target: string, recur = false) {
  if (!await _exists(source)) {
    return;
  }
  if (await _is_dir(source)) {
    if (!recur) {
      await _mkdir(path.dirname(target));
      throw new Error('Only support copy file with recur=false');
    }
    const files = await readdir(source);
    await Promise.all(files.map(async (filename) => {
      const full = path.join(source, filename);
      await _copy(full, path.join(target, filename), recur);
    }));
  } else {
    await _mkdir(path.dirname(target));
    await copyFile(source, target);
  }
}

/**
 * search files in the directory
 * @param {*} dir 
 * @param {*} ext js|ts ...
 * @param {*} recur 
 * @returns 
 */
export async function _search(dir: string, ext = '*', recur = true) {
  if (!await _exists(dir)) {
    return [];
  }
  if (!(await _is_dir(dir))) {
    throw new Error('Only support dir path');
  }
  const files: string[] = [];
  const exts = ext && ext !== '*' ? ext.split('|') : [];
  const tmp = await readdir(dir);
  await Promise.all(tmp.map(async (filename) => {
    const full = path.join(dir, filename);
    if (await _is_dir(full)) {
      (await _search(full, ext, recur)).forEach(item => files.push(item));
    } else if (recur) {
      const file_ext = _ext(filename);
      if (!exts.length || exts.indexOf(file_ext!) > -1) {
        files.push(full);
      }
    }
  }));
  return files;
}

/**
 * find files in the directory with deep one level
 * @param {*} dir 
 * @param {*} full 
 * @param {*} ext .js|.ts
 * @returns 
 */
export async function _list(dir: string, full = false, ext = '*') {
  if (!await _exists(dir)) {
    return [];
  }
  if (!await _is_dir(dir)) {
    throw new Error('Only support dir path');
  }
  const tmp = await readdir(dir);
  const files: string[] = [];
  const exts = ext.split('|');
  await Promise.all(tmp.map(async (filename) => {
    if (ext !== '*') {
      const fileext = path.extname(filename);
      if (exts.indexOf(fileext) < 0) {
        return;
      }
    }
    if (full) {
      const full_name = path.join(dir, filename);
      files.push(full_name);
    } else {
      files.push(filename);
    }
  }));
  return files;
}

export async function _remove(filepath: string, recur = true) {
  if (filepath === path.sep) {
    throw new Error(`cannot delete root of system with : ${filepath}`);
  }
  if (await _exists(filepath)) {
    if (await _is_dir(filepath)) {
      const dir = filepath;
      const files = await readdir(dir, { withFileTypes: true });
      await Promise.all(files.map(async (dirent) => {
        const full = path.join(dir, dirent.name);
        if (dirent.isDirectory() && recur) {
          await _remove(full, recur);
        } else {
          await unlink(full);
        }
      }));
      await rmdir(filepath);
    } else {
      await unlink(filepath);
    }
  }
}

export async function _md5(filepath: string, charset: Encoding = 'utf8') {
  const hash = crypto.createHash('md5');
  return new Promise((resolve) => {
    const stream = fs.createReadStream(filepath);
    stream.on('data', (chunk: any) => {
      return hash.update(chunk, charset);
    });
    stream.on('end', () => {
      const result = hash.digest('hex');
      resolve(result);
    });
  });
}

/**
 * file system sync
 * @param {*} source 
 * @param {*} target 
 * @param {*} ext js|ts ...
 * @param {*} reback 
 */
export async function _sync(source: string, target: string, ext = '*', reback = true) {
  const sources = await _search(source, ext);
  while (sources.length) {
    const file = sources.shift();
    const target_file = file?.replace(source, target);
    if (await _exists(target_file!)) {
      const md5_s = await _md5(file!);
      const md5_t = await _md5(target_file!);
      if (md5_s !== md5_t) {
        const statS = await stat(file!);
        const statT = await stat(target_file!);
        if (statS.mtime > statT.mtime) {
          await _remove(target_file!);
          await _copy(file!, target_file!);
        }
      }
    } else {
      await _copy(file!, target_file!);
    }
    if (reback) {
      const sleep = async (ms: number | undefined) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      await sleep(100);
      await _sync(target, source, ext, false);
    }
  }
}

export async function _find_root(sub: string, dir: any = null, msg = '') {
  if (null === dir) {
    dir = process.cwd();
  }
  if (await _exists(path.join(dir, sub))) {
    return dir;
  }
  const parent = path.dirname(dir);
  if (!parent || parent === dir) {
    throw new Error(msg ? msg : `Please execute the current command in the directory where "${sub}" is located`);
  }
  return await _find_root(sub, path.dirname(dir), msg);
}



export const getDatesInRange = (startDate: string | number | Date, endDate: number | Date) => {
  const dateArray = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // 将当前日期的副本推入数组
    dateArray.push(new Date(currentDate));
    // 将当前日期增加一天
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
};

