import { Blog, Prisma } from "@prisma/client"
import prisma from "../../app/shared/prisma";
import { paginationHelper } from "../../app/helper/paginationHelper";
import { IPaginationOptions } from "../../app/interface/pagination";
import { IBlogFilterRequest } from "./blogs.interface";
import { blogSearchableFields } from "./blogs.constant";

const createBlogIntoDB = async(payload:Blog, userId:string) => {
    const result = await prisma.blog.create({
    data: {
      ...payload,
      userId,
    },
  });
  return result;
}

const getAllBlogs = async (
  filters: IBlogFilterRequest,
  options: IPaginationOptions
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.BlogWhereInput[] = [];

  // Searchable fields
  if (searchTerm) {
    andConditions.push({
      OR: blogSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // Other filters (dynamic)
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([key, value]) => ({
        [key]: {
          equals: value,
        },
      })),
    });
  }

  const whereConditions: Prisma.BlogWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Fetch filtered and paginated blogs
  const [blogs, total] = await prisma.$transaction([
    prisma.blog.findMany({
      where: whereConditions,
      include: {
        user: true,
      },
      orderBy:
        options.sortBy && options.sortOrder
          ? { [options.sortBy]: options.sortOrder }
          : { publishDate: 'desc' },
      skip,
      take: limit,
    }),
    prisma.blog.count({ where: whereConditions }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: blogs,
  };
};


const updateBlogIntoDB = async (id: string, data: Partial<Blog>) => {
  await prisma.blog.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.blog.update({
    where: { id },
    data,
  });
  return result;
};

const getBlogDetailsFromDB = async(id:string) => {
  const result = await prisma.blog.findUniqueOrThrow({
    where:{
      id
    }
  })

  return result;
}

const deleteBlogFromDB = async(id:string) => {
  const result = await prisma.blog.delete({
    where:{
      id
    }
  })
  return result
}

export const BlogService = {
    createBlogIntoDB,
    getAllBlogs,
    updateBlogIntoDB,
    getBlogDetailsFromDB,
    deleteBlogFromDB
}