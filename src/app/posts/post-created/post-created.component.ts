import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-created',
  templateUrl: './post-created.component.html',
  styleUrl: './post-created.component.css'
})
export class PostCreatedComponent implements OnInit {
  private mode: string = 'create';
  private postId: string;
  public post: Post;
  public isLoading: boolean = false;
  form: FormGroup;
  imagePreview: string;

  constructor(private postService: PostsService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required] }),
      'content': new FormControl(null, { validators: [Validators.required] }),
      'image': new FormControl(null, { validators: [Validators.required], asyncValidators: mimeType })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((post) => {
          this.isLoading = false;
          this.post = { id: post._id, title: post.title, content: post.content, imagePath: post.imagePath };

          this.form.setValue({ 'title': this.post.title, 'content': this.post.content, 'image': this.post.imagePath })
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      } // if - else
    });
  } // ngOnInit

  // Reactive forms approach
  onSavePost() {
    if (this.form.invalid) { return; }

    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    } // if - else

    this.form.reset();
  } // onSavePost

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();

    // Convert the image to a data url
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  } // onImagePicked

  // Template driven approach
  /* onSavePost (form: NgForm) {
    if (form.invalid) { return; }

    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost (form.value.title, form.value.content);
    } else {
      this.postService.updatePost (this.postId, form.value.title, form.value.content);
    } // if - else
    
    form.reset ();
  } // onSavePost */
} // PostCreatedComponent
