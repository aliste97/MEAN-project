import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  totalPosts = 0;
  postsPerPage = 1;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated: boolean = false;
  private authListenerSub: Subscription;

  constructor (private postService: PostsService, private authService: AuthService) {}

  posts: Post[] = [];
  private postSub: Subscription;

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts (this.postsPerPage, this.currentPage);
    this.postSub = this.postService.getPostUpdateListener ().subscribe ((postData: {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
    });

    this.userIsAuthenticated = this.authService.getIsAuth ();
    this.authListenerSub = this.authService.getAuthStatusListener ().subscribe (isAuthenticated => this.userIsAuthenticated = isAuthenticated);
  } // ngOnInit

  onDeletePost (id: string) {
    this.isLoading = true;
    this.postService.deletePost (id).subscribe (() => {
      this.postService.getPosts (this.postsPerPage, this.currentPage);
    });
  } // onDeletePost

  ngOnDestroy(): void {
    this.postSub.unsubscribe ();
    this.authListenerSub.unsubscribe ();
  } // ngOnDestroy

  onChangePage (pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts (this.postsPerPage, this.currentPage);
  } // onChangePage
} // PostListComponent
