import { blogArticles } from '@/app/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl text-foreground">
          Blog de Aromanza
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Tu guía al mundo de la aromaterapia, el bienestar y la vida consciente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogArticles.map((article) => (
          <Card key={article.slug} className="flex flex-col overflow-hidden group">
            <Link href={`/blog/${article.slug}`} className="flex flex-col h-full">
              <CardHeader className="p-0">
                <div className="relative h-60 w-full">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6 flex flex-col flex-grow">
                <CardTitle className="font-headline text-2xl mb-2">{article.title}</CardTitle>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{article.date}</span>
                  </div>
                </div>
                <CardDescription className="line-clamp-4 flex-grow">{article.summary}</CardDescription>
                <div className="mt-4 text-primary font-semibold group-hover:underline">
                  Leer Más
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
