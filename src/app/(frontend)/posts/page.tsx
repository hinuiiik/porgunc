import { redirect } from 'next/navigation'

export default async function CategoryRedirect() {
  return redirect(`/posts/page/1`)
}
