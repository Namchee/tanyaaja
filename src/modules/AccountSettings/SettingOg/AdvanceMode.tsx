/* eslint-disable unused-imports/no-unused-vars */
'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { ArrowTopRightIcon, InfoCircledIcon } from '@radix-ui/react-icons'

import { valibotResolver } from '@hookform/resolvers/valibot'
import { User } from 'firebase/auth'
import { maxLength, minLength, object, type Output, string } from 'valibot'

// @ts-ignore
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { patchUpdateCustomOg, postAddNewCustomOg } from '@/lib/api'
import { trackEvent } from '@/lib/firebase'
import { CustomOg, UserProfile } from '@/lib/types'

const schema = object({
  publik: string('Kode laman publik perlu disi terlebih dahulu.', [
    minLength(2, 'Kode laman publik butuh paling tidak 2 karakter.'),
    maxLength(10000, 'Kode laman publik hanya bisa maksimal 10000 karakter.'),
  ]),
  question: string('Kode laman pertanyaan perlu disi terlebih dahulu.', [
    minLength(2, 'Kode laman pertanyaan butuh paling tidak 2 karakter.'),
    maxLength(
      10000,
      'Kode laman pertanyaan hanya bisa maksimal 10000 karakter.',
    ),
  ]),
})

type FormValues = Output<typeof schema>

export default function AdvanceMode({
  isLoading,
  owner,
  user,
  existingOg,
}: {
  isLoading: boolean
  owner: UserProfile | null | undefined
  user: User | null
  existingOg: CustomOg[] | null | undefined
}) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const form = useForm<FormValues>({
    resolver: valibotResolver(schema),
    defaultValues: {
      publik: '',
      question: '',
    },
  })

  async function onSubmit(data: FormValues) {
    trackEvent('click update og image advance')
    if (user) {
      try {
        setIsSubmitting(true)
        try {
          if (existingOg && existingOg.length > 0) {
            // patch
            await patchUpdateCustomOg(user, {
              uid: user?.uid,
              slug: owner?.slug || '',
              mode: 'advance',
              theme: existingOg?.[0]?.theme || 'hyper',
              simpleText: existingOg?.[0]?.simple_text || '',
              codePublic: data?.publik,
              codeQuestion: data?.question,
            })
            toast({
              title: 'Perubahan berhasil disimpan',
              description: `Berhasil menyimpan perubahan setelan og image custom!`,
            })
          } else {
            // create
            await postAddNewCustomOg(user, {
              uid: user?.uid,
              slug: owner?.slug || '',
              mode: 'advance',
              theme: 'hyper',
              simpleText: '',
              codePublic: data?.publik,
              codeQuestion: data?.question,
            })
            toast({
              title: 'Perubahan berhasil disimpan',
              description: `Berhasil menyimpan perubahan og image custom!`,
            })
          }
        } catch (err) {
          toast({
            title: 'Gagal menyimpan',
            description: `Gagal saat mencoba mengecek ketersediaan slug, silahkan coba beberapa saat lagi!`,
          })
        }
        setIsSubmitting(false)
      } catch (error) {
        setIsSubmitting(false)
        toast({
          title: 'Gagal menyimpan',
          description: `Gagal menyimpan perubahan setelan, coba sesaat lagi!`,
        })
      }
    }
  }

  useEffect(() => {
    if (existingOg && existingOg.length > 0) {
      form.setValue('publik', existingOg[0].code_public)
      form.setValue('question', existingOg[0].code_question)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingOg])

  return (
    <div className="w-full flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 mt-4">
      <section className="flex-1 lg:max-w-2xl">
        <Alert className="mb-4">
          <InfoCircledIcon className="h-4 w-4" />
          <AlertTitle>Tips!</AlertTitle>
          <AlertDescription>
            <ul className="list-disc">
              <li className="m-0">
                <div>
                  Kamu bisa mencoba kodemu di{' '}
                  <Link
                    href="https://og-playground.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center text-blue-400"
                  >
                    og-playground.vercel.app
                    <ArrowTopRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </li>
              <li className="m-0">
                <div>Gunakan ukuran 800x600 (width: 800px, height: 400px)</div>
              </li>
              <li className="m-0">
                <div>
                  Kamu bisa menggunakan{' '}
                  <Link
                    href="https://hypercolor.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center text-blue-400"
                  >
                    hypercolor.dev
                    <ArrowTopRightIcon className="h-4 w-4" />
                  </Link>
                  untuk inspirasi gradient
                </div>
              </li>
              <li className="m-0">
                <div>
                  Kamu bisa menggunakan parameter{' '}
                  <code className="text-blue-400">[question]</code> untuk
                  menggantikan pertanyaan
                </div>
              </li>
            </ul>
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="publik"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OG Image Laman Publik</FormLabel>
                  <FormDescription>
                    Kode ini akan digunakan untuk og image laman publik Anda.
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Kode untuk OG image laman publik Anda"
                      className="resize-y"
                      rows={10}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OG Image Laman Pertanyaan</FormLabel>
                  <FormDescription>
                    Kode ini akan digunakan untuk og image laman publik Anda.
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Kode untuk OG image laman pertanyaan Anda"
                      className="resize-y"
                      rows={10}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? 'Processing' : 'Simpan Perubahan'}
            </Button>
          </form>
        </Form>
      </section>
    </div>
  )
}
