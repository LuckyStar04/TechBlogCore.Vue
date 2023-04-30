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

export interface GroupedArticleList {
    year: number,
    articles: Array<ArticleList>,
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
    parentId: number,
    articleId: number,
    userName: string,
    email: string,
    role: string,
    content: string,
    replyTo: string,
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

export interface MenuInfo {
    name: string,
    route: string,
    index: string,
}

export interface NavItem {
    level: string,
    id: string,
    title: string,
    children: Array<NavItem>,
    parent: NavItem|null,
}

export interface Chat {
    isMe: Boolean,
    content: string,
    time: Date,
}