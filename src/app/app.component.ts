import { Component } from '@angular/core';
import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = '1-app';

  posts: Post[] = [];

  onPostAdded (post: Post) {
    this.posts.push (post);
  }
}
