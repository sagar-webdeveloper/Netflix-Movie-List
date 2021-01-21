import {Injectable} from '@angular/core';
import {TableData} from '../models/dynamic-data.model'

@Injectable()
export class DataService{
    constructor() { }
    private data:TableData[];
    private uploadedFiles:Array<any>=[];

    setData(data){
        this.data=data;
    }

    getData(){
        return this.data;
    }

    getPaginateData(pageNumber:number=1,pageSize:number=5){
        if(!this.data) return [];
        let dataLength=this.data.length;
        return {
            "tables":this.data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
            "pagination":{
                "pageCount":Math.ceil(dataLength/pageSize),
                "CurrentPage":pageNumber,
                "pageSize":pageSize,
                "nextPage":Math.ceil(dataLength/pageSize)>pageNumber?pageNumber+1:null,
                "previousPage":pageNumber==1?null:pageNumber-1
            }
        };
        //return this.data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
    }

    setFile(file){
        this.uploadedFiles.push(file)
    }

    getFiles(){
        return this.uploadedFiles;
    }
}