import type { Store, User } from '@/services/chat'

class InMemoryStore implements Store {
  private readonly map: Map<string, User>

  constructor() {
    this.map = new Map()
  }

  getUser = (userId: string): User | undefined => this.map.get(userId)

  getUsers = (): User[] => [...this.map.values()]

  saveUser(user: User): void {
    this.map.set(user.id, user)
  }
}

export default InMemoryStore
