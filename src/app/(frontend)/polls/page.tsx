import { redirect } from 'next/navigation'

export default async function CategoryRedirect() {
  return redirect(`/polls/page/1`)
}
