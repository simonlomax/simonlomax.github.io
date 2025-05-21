---
title: Welcome to the Blog
description: A look at what it took to get this blog up and running and how I went about learning a new framework
date: 05/19/2025
featured: true
tags: engineering
slug: welcome-to-the-blog
image: /imgs/blog/Hero_Astro.png
---

**Hello** and welcome to my blog! I've been meaning to put one of these together for years now. I've set up my fair share of Wordpress sites back in my hay day but when I finally decided to sit down and get things rolling here. I set out a couple of goals for myself. 

1. It needed to be simple
2. I wanted to learn something new
3. I wanted to serve it statically


## It needed to be simple

This one is pretty obvious. Unfortunately I don't have too much time on my hands these days to go on coding benders so I wanted to keep a small scope to make sure that I actually got through the project and produced something. 

## I wanted to learn something new

Continued learning is important, I wanted to take a look at the current state of frameworks out there and see if there was something that I could learn the basics relatively quickly and something that might turn out to be useful in future projects. 

## I wanted to serve it statically

This was an important one. I want to host my blog on GitHub pages. I'm not interested in setting up hosting and configuring everything. I want to build my project and push it as effortlessly as possible. So I started looking at what options were available in the static-site generator space these days.

|Name|Language|Notes|
|---|---|---|
|[Jekyll](https://jekyllrb.com)|Ruby|Recommended by Github|
|[Gatsby](https://www.gatsbyjs.com)|JS|React based with lots of plugins|
|[Astro](https://astro.build)|JS|Fast, component based|

I have been down the road of Jekyll in the past, unfortunately my Ruby skills are basic at best and I spent more time digging around in the documentation and on stack overflow than I did creating things. Gatsby seemed like a decent one, I have a lot of experience with React but I felt like I might end up getting too caught up with the amount of plugins that I would lean towards using those over trying the "do-it yourself" mentality which is how I learn. Astro seemed to be the best fit for me. The mantra of "Zero JS by default" really drew me in. I also liked that it was framework agnostic meaning that I could throw anything at it and it would "just work".  

So we kicked it off

```bash
npm create astro@latest
```

First of all, Astro has a very pretty CLI, very straight forward and easy to understand. I set up my project structure as follows

```bash
├── src
│   ├── blog
│   │   ├── post1.md
│   │   ├── post2.md
│   │   ├── post3.md
│   ├── components
│   ├── imgs
│   ├── js
│   ├── pages
│   │   ├── blog
│   │   │   ├── slug.astro
│   │   ├── index.astro
│   │   ├── blog.astro
│   │   ├── career.astro
│   ├── css 
```

Astro works by setting up .astro files for each of your pages. Inside these astro files you have basic HTML and Astro components that are defined as part of the frontmatter for that page. This felt very similar to how React components are created and used. You have your props that can trickle down from parent to child components. 

```html
---
import Head from "../components/Head.astro"
import BlogList from "../components/BlogList.astro"
import NavBar from "../components/NavBar.astro"
import Foot from "../components/Foot.astro"
---
<html lang="en">
	<Head title="My Awesome Title" />
	<body>
		<NavBar activePage="home"/>
		<BlogList />
		<CategorySection />
		<Foot />
	</body>
</html>
```
Accessing the props inside of a component is straight forward, you declare them in the frontmatter and then they can be used from inside the component itself. You can also import css directly like this and Astro does it's magic to optimize it for that specific component. 

```html
---
const {activePage, ...props} = Astro.props
import "../styles/nav.css"
---

...

<ul>
    <li><a href="/index.html" class={activePage === "home" ? "active" : ""}>Home</a></li>
    <li><a href="/blog" class={activePage === "blog" ? "active" : ""}>Blog</a></li>
    <li><a href="/career" class={activePage === "career" ? "active" : ""}>My Career</a></li>
</ul>

...

```


The learning curve on this was pretty shallow. To Astros credit their documentation is phenominal. I was able to get the blog up and running very quickly just following along. Majority of my time spent was getting the styles and actual content together. 

## Conclusion

Overall this was an enjoyable little project. I now have a way to write up some of the things that come to me. My plan is to add articles that goes in to details on the thoughts and processes that come up while working as a software engineer and my own take on these. I hope you enjoy reading and thanks for stopping by.
