import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded as { adminId: number }
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export async function generateToken(adminId: number) {
  return jwt.sign({ adminId }, JWT_SECRET, { expiresIn: '7d' })
} 