import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute, ParamMap } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {DataService} from '../services/manage-movie-list.services';
import {TableData} from '../models/dynamic-data.model'


@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  private movieId:string;
  private selectedMovie:TableData[];
  form: FormGroup;
  constructor(private dataservice: DataService,
    private router: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {

    //Initialise the form and validation using reactive form 
    this.form = new FormGroup({
      title: new FormControl(null, {
      validators: [Validators.required]}),
      type: new FormControl(null, { validators: [Validators.required] }),
      releaseYear: new FormControl(null, { validators: [Validators.required] }),
      rating: new FormControl(null, { validators: [Validators.required] }),
      duration: new FormControl(null, { validators: [Validators.required] }),
      country: new FormControl(null, { validators: [Validators.required] }),
      cast: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null, { validators: [Validators.required] }),
      show_id: new FormControl(null, {  }),  
      })

    
  this.selectedMovie = this.dataservice.getData(); // Fetch the Table data by service, when user click on table item
  this.activeRoute.paramMap.subscribe((paramMap:ParamMap)=>{ //get the ID passed in movie-list component using route param
    if(paramMap.has("movieId")){
      this.movieId=paramMap.get("movieId");
      console.log( this.movieId)
      let item = this.selectedMovie.find(item => item.show_id === this.movieId); // Fetching the Object to display the data using id
      console.log(item);
      this.form.setValue({ // set the data to form
        title:item.title,
      type:item.type,
      releaseYear:item.releaseYear,
      rating: item.rating,
      duration:item.duration,
      country:item.country,
      cast:item.cast,
      description:item.description,
      show_id:item.show_id
      });

    }
  })

    
    }
  
    keyPressAlphaNumericWithCharacters(event) {  // Restrict user to type the special character
      var inp = String.fromCharCode(event.keyCode);
      // Allow numbers, alpahbets, space, underscore
      if (/[a-zA-Z0-9-_ ]/.test(inp)) {
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }

    onSavePost(){  // On update button, Data will be updated in table using setData Service
      if (this.form.invalid) {
        return;
      }else{
        this.selectedMovie[this.selectedMovie.findIndex(el => el.show_id === this.movieId)] = this.form.value;
        this.dataservice.setData(this.selectedMovie);
        this.router.navigate(['']);
      }
    }

    delete(){ //Deleting the Selected Item 
      this.dataservice.setData(this.selectedMovie.filter(prop => prop.show_id !==this.movieId ));
      this.router.navigate(['']);
    }

}
