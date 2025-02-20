import { type ClassValue, clsx } from 'clsx'
// eslint-disable-next-line
// @ts-ignore
import domtoimage from 'dom-to-image-more'
import { twMerge } from 'tailwind-merge'

import { ClassMap } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function copyTextToClipboard(text: string) {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text)
  } else {
    return document.execCommand('copy', true, text)
  }
}

export function addDays(date: string, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)

  return result
}

/**
 * // https://dev.to/nombrekeff/download-file-from-blob-21ho
 * @param blob <Blob>
 * @param filename <string>
 */
export function downloadFromHref(href: string, filename = 'question.png') {
  // Create a link element
  const link = document.createElement('a')

  link.href = href
  link.download = filename
  link.setAttribute('data-filename', filename)
  link.style.display = 'none'

  // Append link to the body
  document.body.appendChild(link)

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  )

  // Remove link from body
  document.body.removeChild(link)
}

export function downloadQuestion(questionId: string) {
  const domQuestion = document.querySelector('#question-card')
  if (domQuestion) {
    // eslint-disable-next-line
    // @ts-ignore
    domtoimage
      .toPng(domQuestion)
      .then(function (dataUrl: string) {
        const filename = `question-${questionId || Date.now()}.png`
        downloadFromHref(dataUrl, filename)
      })
      .catch(function (error: Error) {
        console.error('Opps, something went wrong!', error)
      })
  }
}

export const GRADIENTS: ClassMap[] = [
  {
    id: 'hyper',
    class: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500',
    cssNative:
      'linear-gradient(to right, rgb(236, 72, 153), rgb(239, 68, 68), rgb(234, 179, 8))',
  },
  {
    id: 'oceanic',
    class: 'bg-gradient-to-r from-green-300 via-blue-500 to-purple-600',
    cssNative:
      'linear-gradient(to right, rgb(134, 239, 172), rgb(59, 130, 246), rgb(147, 51, 234))',
  },
  {
    id: 'pumkin',
    class: 'bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-700',
    cssNative:
      'linear-gradient(to right, rgb(254, 240, 138), rgb(250, 204, 21), rgb(161, 98, 7))',
  },
  {
    id: 'candy',
    class: 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400',
    cssNative:
      'linear-gradient(to right, rgb(249, 168, 212), rgb(216, 180, 254), rgb(129, 140, 248))',
  },
]

export const CARD_SCALES: ClassMap[] = [
  {
    id: 'fluid',
    class: 'w-[600px] text-2xl',
  },
  {
    id: '300px',
    class: 'w-[300px] min-h-[300px] text-xl',
  },
  {
    id: '400px',
    class: 'w-[400px] min-h-[400px] text-2xl',
  },
  {
    id: '600px',
    class: 'w-[600px] min-h-[600px] text-2xl',
  },
  {
    id: '800px',
    class: 'w-[800px] min-h-[800px] text-3xl',
  },
]

export function parseJwtToken(token: string) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}

export const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/fun-emoji/svg'
export const RANDOM_AVATARS = [
  DEFAULT_AVATAR,
  'https://api.dicebear.com/7.x/avataaars-neutral/svg',
  'https://api.dicebear.com/7.x/adventurer/svg',
  'https://api.dicebear.com/7.x/avataaars/svg',
  'https://api.dicebear.com/7.x/adventurer-neutral/svg',
  'https://api.dicebear.com/7.x/big-ears/svg',
  'https://api.dicebear.com/7.x/big-ears-neutral/svg',
  'https://api.dicebear.com/7.x/bottts/svg',
  'https://api.dicebear.com/7.x/bottts-neutral/svg',
  'https://api.dicebear.com/7.x/lorelei/svg',
  'https://api.dicebear.com/7.x/notionists/svg',
  'https://api.dicebear.com/7.x/open-peeps/svg',
  'https://api.dicebear.com/7.x/pixel-art/svg',
  'https://api.dicebear.com/7.x/thumbs/svg',
]

export const randomizeAvatar = () => {
  const randomIndex = Math.floor(Math.random() * RANDOM_AVATARS.length)
  return RANDOM_AVATARS[randomIndex]
}
