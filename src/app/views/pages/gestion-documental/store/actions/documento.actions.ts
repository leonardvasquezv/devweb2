import { ObjParam } from "@core/interfaces/base/objParam.interface";
import { ResponseWebApi } from "@core/interfaces/base/responseWebApi.interface";
import { Documento } from "@core/interfaces/documento.interface";
import { Proceso } from "@core/interfaces/proceso.interface";
import { createAction, props } from "@ngrx/store";
import { DataEds } from '../../../../../core/interfaces/data-eds.interface';


export enum DocumentoActionTypes {
    LoadDocumentos = '[Documentos] Load Documentos',
    LoadDocumentosSuccess = '[Documentos] Load Documentos Success',
    LoadDocumentosError = '[Documentos] Load Documentos Error',
    CleanDocumentosList = '[Documentos] Clean Documentos List',

    CreateDocumentos = '[Documento] Create Documento',
    CreateDocumentosSuccess = '[Documento] Create Documento Success',
    CreateDocumentosError = '[Documento] Create Documento Error',

    EUpdateDocumento = '[Documento] Update Documento',
    EUpdateDocumentoSuccess = '[Documento] Update Documento Success',
    EUpdateDocumentoError = '[Documento] Update Documento Error',

    Documentoselected = '[Documento] Documento Selected',

    Redirect = '[Documento] Redirect Eds y Proceso ',
    AddDocumento = '[Documento] Create Documento',
    CleanRedirect = '[Documento] Clean Redirect Eds y Proceso '

}


export const LoadDocumentos = createAction(
    DocumentoActionTypes.LoadDocumentos,
    props<{ criterios: Array<ObjParam> }>()
);
export const LoadDocumentosSuccess = createAction(
    DocumentoActionTypes.LoadDocumentosSuccess,
    props<{ payload: ResponseWebApi }>()
);
export const LoadDocumentosError = createAction(
    DocumentoActionTypes.LoadDocumentosError,
    props<{ payload: any }>()
);
export const CleanAllDocumentosList = createAction(
    DocumentoActionTypes.CleanDocumentosList,
);
export const createDocumentos = createAction(
    DocumentoActionTypes.CreateDocumentos,
    props<{ documentos: Documento }>()
);
export const createDocumentosSuccess = createAction(
    DocumentoActionTypes.CreateDocumentosSuccess,
    props<{ payload: Documento }>()
);
export const createDocumentosError = createAction(
    DocumentoActionTypes.CreateDocumentosError,
    props<{ payload: any }>()
);
export const UpdateDocumento = createAction(
    DocumentoActionTypes.EUpdateDocumento,
    props<{ documento: Documento }>()
);
export const UpdateDocumentoSuccess = createAction(
    DocumentoActionTypes.EUpdateDocumentoSuccess,
    props<{ payload: ResponseWebApi }>()
);
export const UpdateDocumentoError = createAction(
    DocumentoActionTypes.EUpdateDocumentoError,
    props<{ payload: any }>()
);
export const SelectDocumento = createAction(
    DocumentoActionTypes.Documentoselected,
    props<{ selectedDocumentoid: number }>()
);
export const Redirect = createAction(
    DocumentoActionTypes.Redirect,
    props<{ eds: DataEds, proceso: Proceso }>()

);
export const AddDocumento = createAction(
    DocumentoActionTypes.AddDocumento,
    props<{ documento: Documento }>()
);
export const CleanRedirect = createAction(
    DocumentoActionTypes.CleanRedirect,
);
