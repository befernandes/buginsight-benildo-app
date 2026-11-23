
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bug as BugIcon, ArrowLeft, Send } from 'lucide-react'

import { createBug } from '../../services/api'

export default function NewBugPage() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [stackTrace, setStackTrace] = useState('')
  const [severity, setSeverity] = useState<
    'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  >('MEDIUM')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setLoading(true)
      setError(null)

      await createBug({
        title: title.trim(),
        description: description.trim(),
        stackTrace: stackTrace.trim() || undefined,
        severity,
      })

      navigate('/home')
    } catch (err) {
      console.error('Error creating bug:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to register bug. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary'

  return (
    <div className="min-h-full bg-background px-5 py-8 text-foreground md:px-8">
      <div className="mx-auto max-w-3xl space-y-8">

        <div>
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="mb-5 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-3">
              <BugIcon className="h-6 w-6 text-blue-400" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Report a New Bug
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Provide the details of the issue you encountered.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border border-border bg-card p-6"
        >
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Bug Title *
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Example: Login button is not working"
              maxLength={150}
              required
              className={inputClass}
            />

            <p className="text-xs text-muted-foreground">
              Maximum 150 characters.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description *
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what happened and how to reproduce the issue..."
              maxLength={2000}
              rows={5}
              required
              className={inputClass}
            />

            <p className="text-xs text-muted-foreground">
              Maximum 2000 characters.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="stackTrace" className="text-sm font-medium">
              Stack Trace
              <span className="ml-2 text-muted-foreground">(Optional)</span>
            </label>

            <textarea
              id="stackTrace"
              value={stackTrace}
              onChange={(event) => setStackTrace(event.target.value)}
              placeholder="Paste the error stack trace here..."
              rows={5}
              className={`${inputClass} font-mono text-xs`}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="severity" className="text-sm font-medium">
              Severity *
            </label>

            <select
              id="severity"
              value={severity}
              onChange={(event) =>
                setSeverity(
                  event.target.value as
                    | 'LOW'
                    | 'MEDIUM'
                    | 'HIGH'
                    | 'CRITICAL',
                )
              }
              className={inputClass}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="rounded-lg border border-border px-5 py-3 text-sm font-medium hover:bg-muted"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {loading ? 'Submitting...' : 'Submit Bug'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
