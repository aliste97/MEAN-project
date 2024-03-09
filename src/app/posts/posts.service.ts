import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Observable, Subject, map } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class PostsService {
    private posts: Post[] = [];
    private postsChanged: Subject<{posts: Post[], postCount: number}> = new Subject<{posts: Post[], postCount: number}>();

    constructor(private http: HttpClient, private router: Router) { }

    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
        this.http
            .get<{ message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
            .pipe(
                map ((postData) => {
                    return { posts: postData.posts.map(post => {
                        return { title: post.title, content: post.content, id: post._id, imagePath: post.imagePath }
                    }), maxPosts: postData.maxPosts };
                })
            )
            .subscribe((postsData) => {
                this.posts = postsData.posts;
                this.postsChanged.next({ posts: [...this.posts], postCount: postsData.maxPosts });
            });
    } // getPosts

    getPostUpdateListener() {
        return this.postsChanged.asObservable();
    } // getPostUpdateListener

    getPost(id: string) {
        return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>('http://localhost:3000/api/posts/' + id);
    } // getPost

    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;
        if (typeof (image) === 'object') {
            postData = new FormData ();
            postData.append ("id", id);
            postData.append ("title", title);
            postData.append ("content", content);
            postData.append ("image", image, title);
        } else {
            postData = { id: id, title: title, content: content, imagePath: image };
        } // if - else
        this.http
            .put('http://localhost:3000/api/posts/' + id, postData).subscribe(response => {
                this.router.navigate(['/']);
            });
    } // updatePost

    addPost(title: string, content: string, image: File) {
        // const post: Post = {id: null, title: title, content: content}
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);

        this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData).subscribe((response) => {
            this.router.navigate(['/']);
        });
    } // addPost

    deletePost(id: string) {
        return this.http
            .delete('http://localhost:3000/api/posts/' + id)
    } // deletePost
} // PostsService
