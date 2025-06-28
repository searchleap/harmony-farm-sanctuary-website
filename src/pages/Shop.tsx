import { ShoppingBag } from 'lucide-react'
import { H1, BodyLarge, BodyText, Card, CardContent, Button } from '../components/ui'

export function ShopPage() {
  console.log('🛍️ ShopPage rendered')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sanctuary-50 to-earth-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <H1 variant="sanctuary" className="mb-6">Sanctuary Shop</H1>
          <BodyLarge variant="sanctuary" className="mb-12">
            Support our mission by purchasing sanctuary merchandise. Every purchase helps care for our rescued animals.
          </BodyLarge>
          
          <Card variant="elevated">
            <CardContent>
              <ShoppingBag className="w-16 h-16 text-sanctuary-600 mx-auto mb-6" />
              <BodyLarge className="mb-4">Coming Soon!</BodyLarge>
              <BodyText className="mb-6">
                Our online shop is currently being developed. Soon you'll be able to purchase t-shirts, mugs, and other items featuring our rescued animals.
              </BodyText>
              <Button variant="secondary">Notify Me When Available</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}