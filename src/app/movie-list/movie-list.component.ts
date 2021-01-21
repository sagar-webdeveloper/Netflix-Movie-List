import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import * as XLSX from 'xlsx';
import {TableData} from '../models/dynamic-data.model'
import {DownloadService} from '../services/download-excel.service'
import {DataService} from '../services/manage-movie-list.services'
import {mimeType} from '../services/mime-type.validator'

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {
  form: FormGroup;
  tableData:any;
  movieListLoaded:boolean=false;
  uploadHistory:any;
  pageNumber:number=1;
  pageSize:number=8;
  constructor(private router: Router,
              private downloadService: DownloadService,
              private dataservice: DataService) { }

  ngOnInit(): void {
    this.form = new FormGroup({  //Initialise the Form and check mimeType
      excel: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
    }) }) 
    this.tableData=this.dataservice.getPaginateData(); //Get table Data by service when user click on back button from detail page
    if(this.tableData.tables && this.tableData.tables.length>0){
      this.movieListLoaded=true; 
    }
  }

  loadData(pageNumber,pageSize:number=this.pageSize){ //To select Item per page
    this.pageNumber=pageNumber;
    this.pageSize=pageSize
    console.log(pageNumber,pageSize);
    this.tableData=this.dataservice.getPaginateData(this.pageNumber,this.pageSize);
  }

  onFilePicked(event: Event) { // On Excel File upload
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = (event.target as HTMLInputElement).files[0];
    console.log(file);
    this.form.patchValue({ excel: file });
    this.form.get("excel").updateValueAndValidity();
    if(this.form.invalid){
      return;
    }
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
     console.log(jsonData);
     this.dataservice.setData(<TableData>jsonData.netflix_titles);
     this.tableData=this.dataservice.getPaginateData();

     this.movieListLoaded=true;
     console.log(this.tableData);
     //Show Recent File
     this.dataservice.setFile({'upload_at':new Date(),'name':file.name,'size':this.bytesToSize(file.size)});
     this.uploadHistory=this.dataservice.getFiles();
    }
    reader.readAsBinaryString(file);
  }

  bytesToSize(bytes) { // To Display File Size
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    let i:number = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
 }

  download(){ // Export Table Data to Excel using service
   this.downloadService.exportAsExcelFile(this.tableData.tables,'myNetflix-Collection');
  }

  edit(id:string){ // When Click on Table Item For detail view
    console.log("edit",+this.tableData);
    this.router.navigate(['/moviedetails',id]);
  }

}
