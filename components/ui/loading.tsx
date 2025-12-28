"use client"

import React from "react"

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
      </div>
      <p className="text-sm text-muted-foreground">加载中...</p>
    </div>
  )
}

const LoadingDots = () => {
  return (
    <div className="flex items-center gap-1">
      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></div>
    </div>
  )
}

export { LoadingSpinner, LoadingDots }