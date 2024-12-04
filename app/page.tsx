'use client'

import { useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { sendWebhook } from './actions/sendWebhook'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
})

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Sending...' : 'Send to Discord'}
    </Button>
  )
}

export default function Home() {
  const [message, setMessage] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [showWebhookInput, setShowWebhookInput] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    const savedWebhookUrl = localStorage.getItem('webhookUrl')
    if (savedWebhookUrl) {
      setWebhookUrl(savedWebhookUrl)
    }
  }, [])

  useEffect(() => {
    if (webhookUrl) {
      localStorage.setItem('webhookUrl', webhookUrl)
    }
  }, [webhookUrl])

  async function handleSubmit(formData: FormData) {
    const result = await sendWebhook(formData)
    if (result.error) {
      setFeedback({ type: 'error', message: result.error })
    } else {
      setFeedback({ type: 'success', message: 'Message sent to Discord' })
      setMessage('')
    }
  }

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center p-24 ${poppins.className}`}>
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Discord Webhook Sender</h1>
        <form action={handleSubmit} className="space-y-4">
          <Textarea
            name="message"
            placeholder="Paste your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[200px]"
          />
          {showWebhookInput && (
            <Input
              name="webhookUrl"
              type="url"
              placeholder="Enter Discord webhook URL"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              required
            />
          )}
          <div className="flex justify-between items-center">
            <SubmitButton />
            <button
              type="button"
              onClick={() => setShowWebhookInput(!showWebhookInput)}
              className="text-sm text-blue-500 hover:underline"
            >
              {showWebhookInput ? 'Hide webhook URL' : 'Enter webhook URL'}
            </button>
          </div>
        </form>
        {feedback && (
          <div className={`p-4 rounded-md ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {feedback.message}
          </div>
        )}
      </div>
      <footer className="absolute bottom-4 right-4 text-sm text-gray-500">
        hbradroc@uwo.ca
      </footer>
    </main>
  )
}

