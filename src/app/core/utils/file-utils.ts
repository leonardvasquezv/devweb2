import { ETiposError } from '@core/enum/tipo-error.enum';
import { ObjFile } from '@core/interfaces/base/objImagenFile.interface';
import { Observable, throwError } from 'rxjs';
import * as XLSX from 'xlsx';

export let FileUtils = {

  /**
   * Metodo para cargar el archivo
   * @param file archivo a transformar
   * @param array array de tipos de extenciones
   * @param allFormats bandera para aceptar todos los formatos
   * @returns Observable de ObjFile
   */
  previewFile(file: File, array: Array<string>, allFormats: boolean = false): Observable<ObjFile> {
    const baseByte = 1048576;
    const objFile = {} as ObjFile;
    objFile.nombre = file.name;
    const mimeType = file.type;
    if (!array.includes(mimeType) && !allFormats) {
      return throwError('Formato de archivo no soportado.');
    }
    return new Observable(obs => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = (reader.result as string)
        objFile.size = file.size / baseByte;
        objFile.url = result;
        objFile.archivo = result.toString().split(',')[1];
        objFile.contentType = mimeType;
        obs.next(objFile);
        obs.complete();
      }
      reader.readAsDataURL(file);
    });
  },


  /**
   * Metodo encargado de convertir un excel a json
   * @param fileReaded archivo a leer
   * @returns observable del archivo procesado
   */
  excelFileToJSON(fileReaded: any): Observable<Array<Object>> {
    return new Observable(obs => {
      const reader = new FileReader();
      reader.readAsBinaryString(fileReaded);
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, {
          type: 'binary'
        });
        const result = {};
        workbook.SheetNames.forEach((sheetName) => {
          let obj: Array<any> = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { blankrows: false, defval: null });
          if (obj.length > 0) {
            const cabecera = ['Id', ...Object.keys(obj[0])];
            obj.forEach((item, index) => {
              obj[index] = { Id: index, ...item, sheetName };
            });
            obj = [cabecera, ...obj];
            obs.next(obj);
            obs.complete();
          }
        });
      }
    });
  },

  previewImagen(files: any, imagenFile: ObjFile): ObjFile {
    if (files.length === 0) return;
    const mimeType = files[0].type;
    imagenFile.nombre = files[0].name;
    if (mimeType.match(/image\/*/) == null) {
      this._utils.procesarErrorWebApi('Formato de imagen no soportado.', ETiposError.info);
      return;
    }
    const reader = new FileReader();
    imagenFile.url = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      imagenFile.url = reader.result;
      imagenFile.archivo = reader.result.toString().split(',')[1];
    }
    return imagenFile;
  },

}
