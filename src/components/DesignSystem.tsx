import { useState } from 'react'
import { Heart, Home, Star, AlertCircle } from 'lucide-react'
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  H1, 
  H2, 
  H3, 
  H4, 
  BodyLarge, 
  BodyText, 
  BodySmall,
  GradientText,
  Input,
  Textarea,
  Badge,
  Alert
} from './ui'

export function DesignSystem() {
  const [inputValue, setInputValue] = useState('')
  const [showAlert, setShowAlert] = useState(true)
  
  console.log('🎨 DesignSystem component rendered')
  
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="text-center">
        <H1 variant="sanctuary">
          <GradientText>Harmony Farm Sanctuary</GradientText>
        </H1>
        <BodyLarge variant="sanctuary" className="mt-4">
          Design System & Component Library
        </BodyLarge>
      </div>

      {/* Typography Section */}
      <Card variant="elevated" padding="lg">
        <CardHeader>
          <CardTitle>Typography System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <H1>Heading 1 - Hero Title</H1>
              <H2 className="mt-2">Heading 2 - Section Title</H2>
              <H3 className="mt-2">Heading 3 - Subsection</H3>
              <H4 className="mt-2">Heading 4 - Component Title</H4>
            </div>
            
            <div className="space-y-2">
              <BodyLarge>Large body text for introductions and important content</BodyLarge>
              <BodyText>Regular body text for general content and descriptions</BodyText>
              <BodySmall variant="muted">Small text for captions and metadata</BodySmall>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Button Section */}
      <Card variant="elevated" padding="lg">
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <H4 className="mb-4">Button Variants</H4>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="donate">
                  <Heart className="w-4 h-4 mr-2" />
                  Donate Now
                </Button>
              </div>
            </div>
            
            <div>
              <H4 className="mb-4">Button Sizes</H4>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>
            
            <div>
              <H4 className="mb-4">Button States</H4>
              <div className="flex flex-wrap gap-4">
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards Section */}
      <Card variant="elevated" padding="lg">
        <CardHeader>
          <CardTitle>Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
              </CardHeader>
              <CardContent>
                <BodyText>Basic card with standard shadow</BodyText>
              </CardContent>
            </Card>
            
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
              </CardHeader>
              <CardContent>
                <BodyText>Card with hover effects and larger shadow</BodyText>
              </CardContent>
            </Card>
            
            <Card variant="outlined">
              <CardHeader>
                <CardTitle>Outlined Card</CardTitle>
              </CardHeader>
              <CardContent>
                <BodyText>Card with border instead of shadow</BodyText>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Form Elements */}
      <Card variant="elevated" padding="lg">
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Enter your name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                helpText="This will be used for your volunteer application"
              />
              
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                error="Please enter a valid email address"
              />
              
              <Textarea
                label="Message"
                placeholder="Tell us about yourself..."
                rows={4}
                helpText="Share your interest in volunteering"
              />
            </div>
            
            <div className="space-y-4">
              <H4>Badges</H4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="success">Available</Badge>
                <Badge variant="warning">Limited</Badge>
                <Badge variant="error">Urgent</Badge>
                <Badge variant="info">New</Badge>
                <Badge variant="sponsored">
                  <Star className="w-3 h-3 mr-1" />
                  Sponsored
                </Badge>
              </div>
              
              <div className="space-y-2">
                <H4>Badge Sizes</H4>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge size="sm" variant="success">Small</Badge>
                  <Badge size="md" variant="success">Medium</Badge>
                  <Badge size="lg" variant="success">Large</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Section */}
      <Card variant="elevated" padding="lg">
        <CardHeader>
          <CardTitle>Alerts & Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {showAlert && (
              <Alert 
                variant="success" 
                title="Welcome to Harmony Farm Sanctuary!"
                dismissible
                onDismiss={() => setShowAlert(false)}
              >
                Thank you for visiting our website. Explore our rescued animals and learn how you can help.
              </Alert>
            )}
            
            <Alert variant="info" title="Visiting Hours">
              The sanctuary is open for public tours on weekends from 10 AM to 4 PM.
            </Alert>
            
            <Alert variant="warning">
              <BodyText>
                <strong>Weather Notice:</strong> Tours may be cancelled during severe weather conditions.
              </BodyText>
            </Alert>
            
            <Alert variant="error" title="Emergency Contact">
              If you see an animal in distress, please call our emergency line immediately.
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card variant="elevated" padding="lg">
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <H4 className="mb-4">Sanctuary Colors</H4>
              <div className="grid grid-cols-5 gap-2">
                {[50, 100, 300, 600, 800].map(shade => (
                  <div key={shade} className="text-center">
                    <div 
                      className={`w-full h-16 rounded-lg bg-sanctuary-${shade} border`}
                    />
                    <BodySmall className="mt-1">{shade}</BodySmall>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <H4 className="mb-4">Earth Colors</H4>
              <div className="grid grid-cols-5 gap-2">
                {[50, 100, 300, 600, 800].map(shade => (
                  <div key={shade} className="text-center">
                    <div 
                      className={`w-full h-16 rounded-lg bg-earth-${shade} border`}
                    />
                    <BodySmall className="mt-1">{shade}</BodySmall>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Icons */}
      <Card variant="elevated" padding="lg">
        <CardHeader>
          <CardTitle>Icon System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Home className="w-6 h-6 text-sanctuary-600" />
              <BodyText>Home</BodyText>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              <BodyText>Love</BodyText>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              <BodyText>Favorite</BodyText>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-500" />
              <BodyText>Alert</BodyText>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}