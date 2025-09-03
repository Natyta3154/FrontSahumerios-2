import { blogArticles } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = blogArticles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-card">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <article className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-foreground">
              {article.title}
            </h1>
            <div className="mt-4 flex justify-center items-center space-x-4 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <span>&bull;</span>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{article.date}</span>
              </div>
            </div>
          </div>
          
          <div className="relative w-full h-[300px] md:h-[500px] rounded-lg overflow-hidden mb-8">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div
            className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-headline prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
        </article>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}
