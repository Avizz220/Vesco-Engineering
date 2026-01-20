'use client'

import React from 'react'
import { clsx } from 'clsx'

export interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

const Card: React.FC<CardProps> = ({ children, className, hover, onClick }) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-md overflow-hidden',
        hover && 'transition-transform hover:scale-105 hover:shadow-xl cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={clsx('px-6 py-4 border-b border-gray-200', className)}>
      {children}
    </div>
  )
}

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={clsx('px-6 py-4', className)}>
      {children}
    </div>
  )
}

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={clsx('px-6 py-4 border-t border-gray-200 bg-gray-50', className)}>
      {children}
    </div>
  )
}

export default Card
