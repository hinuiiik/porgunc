import { redirect } from 'next/navigation'

export default async function CategoryRedirect({ params }: {params: Promise<{ categorySlug: string }>}) {
  const { categorySlug } = await params;
  return redirect(`/polls/category/${categorySlug}/1`)
}
