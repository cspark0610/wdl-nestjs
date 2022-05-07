import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { API_URL } from 'src/constants/api-url.constant';

@Injectable()
export class FileService {
  wordsQty = 1500;
  async saveFile() {
    return axios
      .get(`${API_URL}${this.wordsQty}`)
      .then(res => {
        const obj = {
          answers: res.data,
        };
        const wordsPath = path.join(process.cwd(), 'src/files/api-words.json');
        fs.writeFileSync(wordsPath, JSON.stringify(obj));
        return obj;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  }
}
