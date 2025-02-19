import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://trackode.vercel.app/",
      priority: 1.0,
      lastModified: new Date().toISOString(),
    },
    {
      url: "https://trackode.vercel.app/admin-dashboard",
      priority: 0.5,
      lastModified: new Date().toISOString(),
    },
    {
      url: "https://trackode.vercel.app/dashboard",
      priority: 0.6,
      lastModified: new Date().toISOString(),
    },
    {
      url: "https://trackode.vercel.app/signin",
      priority: 0.7,
      lastModified: new Date().toISOString(),
    },
    {
      url: "https://trackode.vercel.app/signup",
      priority: 0.8,
      lastModified: new Date().toISOString(),
    },
  ];
}
