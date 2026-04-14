import { groq } from "next-sanity";

export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    mainImage,
    "categories": categories[]->{ _id, title, slug },
    "author": author->{ name, image },
    "excerpt": array::join(string::split((pt::text(body)), "")[0..200], "") + "..."
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    mainImage,
    body,
    "categories": categories[]->{ _id, title, slug },
    "author": author->{ name, image, bio }
  }
`;

export const categoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`;

export const postsByCategoryQuery = groq`
  *[_type == "post" && $categoryId in categories[]->_id] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    mainImage,
    "categories": categories[]->{ _id, title, slug },
    "author": author->{ name, image },
    "excerpt": array::join(string::split((pt::text(body)), "")[0..200], "") + "..."
  }
`;

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description
  }
`;
