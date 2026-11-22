
import { useCallback, useEffect, useState } from 'react'
import { useAuthProfileReady } from 'deepspace'
import {
  Bug as BugIcon,
  CircleAlert,
  Clock3,
  CheckCircle2,
  Sparkles,
  RefreshCw,
} from 'lucide-react'

import { getBugs, type Bug } from '../../services/api'

function severityStyle(severity: string) {
  switch (severity) {
    case 'CRITICAL':
      return 'bg-red-500/10 text-red-400'
    case 'HIGH':
      return 'bg-orange-500/10 text-orange-400'
    case 'MEDIUM':
      return 'bg-amber-500/10 text-amber-400'
    default:
      return 'bg-blue-500/10 text-blue-400'
  }
}

function statusStyle(status: string) {
  switch (status) {
    case 'RESOLVED':
      return 'bg-green-500/10 text-green-400'
    case 'INVESTIGATING':
      return 'bg-amber-500/10 text-amber-400'
    default:
      return 'bg-red-500/10 text-red-400'
  }
}

function formatDate(date: string | null) {
  if (!date) return 'Date unavailable'

  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function HomePage() {
  const { isSignedIn, user } = useAuthProfileReady({
    requireUser: true,
  })

  const [bugs, setBugs] = useState<Bug[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadBugs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getBugs()
      setBugs(data)
    } catch (err) {
      console.error('Error loading bugs:', err)
      setError('Unable to load bugs. Check your backend connection.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBugs()
  }, [loadBugs])

  const totalBugs = bugs.length
  const openBugs = bugs.filter((bug) => bug.status === 'OPEN').length
  const investigatingBugs = bugs.filter(
    (bug) => bug.status === 'INVESTIGATING',
  ).length
  const resolvedBugs = bugs.filter(
    (bug) => bug.status === 'RESOLVED',
  ).length

  const stats = [
    {
      title: 'Total Bugs',
      value: totalBugs,
      icon: BugIcon,
      color: 'text-blue-400',
      background: 'bg-blue-500/10',
    },
    {
      title: 'Open Bugs',
      value: openBugs,
      icon: CircleAlert,
      color: 'text-red-400',
      background: 'bg-red-500/10',
    },
    {
      title: 'Investigating',
      value: investigatingBugs,
      icon: Clock3,
      color: 'text-amber-400',
      background: 'bg-amber-500/10',
    },
    {
      title: 'Resolved',
      value: resolvedBugs,
      icon: CheckCircle2,
      color: 'text-green-400',
      background: 'bg-green-500/10',
    },
  ]

  return (
    <div className="min-h-full bg-background px-5 py-8 text-foreground md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Welcome back
              {isSignedIn && user?.name ? `, ${user.name}` : ''}!
              Here is an overview of your bugs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-purple-400" />
              AI-powered bug analysis
            </div>

            <button
              onClick={loadBugs}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.title}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {stat.title}
                  </p>

                  <div className={`rounded-lg p-2 ${stat.background}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>

                <p className="mt-4 text-3xl font-bold">
                  {loading ? '...' : stat.value}
                </p>
              </div>
            )
          })}
        </div>

        {/* Recent Bugs */}
        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="font-semibold">Recent Bugs</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Latest reported issues
              </p>
            </div>

            <span className="text-sm text-muted-foreground">
              {loading ? 'Loading...' : `${bugs.length} bugs`}
            </span>
          </div>

          {loading ? (
            <div className="px-5 py-12 text-center text-sm text-muted-foreground">
              Loading bugs...
            </div>
          ) : error ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-red-400">{error}</p>

              <button
                onClick={loadBugs}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
              >
                Try again
              </button>
            </div>
          ) : bugs.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <BugIcon className="mx-auto h-10 w-10 text-muted-foreground" />

              <h3 className="mt-3 font-medium">
                No bugs registered yet
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Your registered bugs will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {bugs.map((bug) => (
                <div
                  key={bug.id}
                  className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-lg bg-muted p-2">
                      <BugIcon className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div>
                      <h3 className="text-sm font-medium">
                        {bug.title}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {bug.description}
                      </p>

                      <p className="mt-2 text-xs text-muted-foreground">
                        #{bug.id} · {formatDate(bug.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-11 sm:pl-0">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${severityStyle(bug.severity)}`}
                    >
                      {bug.severity}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle(bug.status)}`}
                    >
                      {bug.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* AI Feature */}
        <section className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-purple-500/10 p-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
            </div>

            <div>
              <h2 className="font-semibold">
                AI Bug Analysis
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Analyze stack traces, identify possible causes and
                receive suggestions to fix software bugs.
              </p>

              <p className="mt-3 text-xs text-purple-400">
                AI analysis feature coming soon
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
