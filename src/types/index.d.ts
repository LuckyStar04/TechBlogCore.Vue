export interface ArticleDetail {
    id: number,
    title: string,
    content: string,
    category: string,
    state: number,
    viewCount: number,
    createTime: Date,
    modifyTime: Date,
    tags: Array<string>,
    comments: Array<Comment>,
}

export interface ArticleList {
    id: number,
    title: string,
    content: string,
    category: string,
    viewCount: number,
    commentCount: number,
    createTime: Date,
}

export interface ArticleEdit {
    title: string,
    content: string,
    category: string,
    state: number,
    tags: Array<string>,
}

export interface ArticleParam {
    pageSize: number,
    pageNumber: number,
    category?: string,
    tag?: string,
    keyword?: string,
    includeDeleted?: boolean
}

export interface Comment {
    id: number,
    userName: string,
    email: string,
    content: string,
    commentTime: Date,
    modifyTime: Date | any,
    children: Array<Comment>
}

export interface CategoryModel {
    id: number,
    name: string,
    count: number
}

export interface TagModel {
    id: number,
    name: string,
    count: number
}

export interface LoginModel {
    username: string,
    password: string
}

export interface RegisterModel {
    username: string,
    email: string,
    password: string,
}

export interface UserInfo {
    user: string,
    email: string,
    role: string,
    avatar: string,
}