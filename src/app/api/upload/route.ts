import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { auth } from '@clerk/nextjs/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'application/pdf',
            'text/plain',
            'text/csv',
        ]

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
        }

        // Create upload directory if it doesn't exist
        const uploadDir = join(process.cwd(), 'public', 'uploads', userId)
        await mkdir(uploadDir, { recursive: true })

        // Generate unique filename
        const ext = file.name.split('.').pop()
        const filename = `${randomUUID()}.${ext}`
        const filepath = join(uploadDir, filename)

        // Save file
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filepath, buffer)

        // Return file URL
        const fileUrl = `/uploads/${userId}/${filename}`

        return NextResponse.json({
            success: true,
            url: fileUrl,
            filename: file.name,
            size: file.size,
            type: file.type,
        })

    } catch (error: any) {
        console.error('Upload error:', error)

        return NextResponse.json(
            { error: error.message || 'Failed to upload file' },
            { status: 500 }
        )
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
}
