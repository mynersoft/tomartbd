// app/buttons/page.jsx
import Button from '@/components/ui/Button';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube,
  FaArrowRight,
  FaTimes,
  FaSpinner,
  FaHeart,
  FaDownload,
  FaUpload,
  FaCheck,
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';

export default function ButtonsPage() {
  const handleClick = (message) => {
    alert(`Button clicked: ${message}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Button Component Showcase
          </h1>
          <p className="text-lg text-gray-600">
            A reusable button component with all features: icons, loading states, variants, and more.
          </p>
        </div>

        <div className="space-y-16">
          
          {/* Section 1: Basic Buttons */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">
              1. Basic Button Variants
            </h2>
            <div className="flex flex-wrap gap-4 items-center">
              <Button onClick={() => handleClick('Default Button')}>
                Default Button
              </Button>
              <Button variant="primary" onClick={() => handleClick('Primary')}>
                Primary
              </Button>
              <Button variant="secondary" onClick={() => handleClick('Secondary')}>
                Secondary
              </Button>
              <Button variant="outline" onClick={() => handleClick('Outline')}>
                Outline
              </Button>
              <Button variant="danger" onClick={() => handleClick('Delete')}>
                Delete
              </Button>
              <Button variant="success" onClick={() => handleClick('Success')}>
                Success
              </Button>
              <Button variant="warning" onClick={() => handleClick('Warning')}>
                Warning
              </Button>
              <Button variant="ghost" onClick={() => handleClick('Ghost')}>
                Ghost
              </Button>
            </div>
          </section>

          {/* Section 2: Buttons with Icons */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">
              2. Buttons with Icons
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Left Icons</h3>
                <Button leftIcon={<FaFacebook />} onClick={() => handleClick('Connect Facebook')}>
                  Connect Facebook
                </Button>
                <Button leftIcon={<FaHeart />} variant="danger" onClick={() => handleClick('Like')}>
                  Like Post
                </Button>
                <Button leftIcon={<FaDownload />} variant="outline" onClick={() => handleClick('Download')}>
                  Download File
                </Button>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Right Icons</h3>
                <Button rightIcon={<FaArrowRight />} variant="outline" onClick={() => handleClick('Next Step')}>
                  Next Step
                </Button>
                <Button rightIcon={<FaUpload />} onClick={() => handleClick('Upload')}>
                  Upload File
                </Button>
                <Button rightIcon={<FaCheck />} variant="success" onClick={() => handleClick('Confirm')}>
                  Confirm Order
                </Button>
              </div>
            </div>
          </section>

          {/* Section 3: Icon-only Buttons */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">
              3. Icon-only Buttons (Accessible)
            </h2>
            <div className="flex flex-wrap gap-4 items-center">
              <Button 
                iconOnly 
                leftIcon={<FaTimes />}
                ariaLabel="Close modal"
                onClick={() => handleClick('Close')}
              />
              <Button 
                iconOnly 
                leftIcon={<FaFacebook />}
                variant="ghost"
                ariaLabel="Share on Facebook"
                onClick={() => handleClick('Share on Facebook')}
              />
              <Button 
                iconOnly 
                leftIcon={<FaHeart />}
                ariaLabel="Add to favorites"
                onClick={() => handleClick('Add to favorites')}
              />
              <Button 
                iconOnly 
                leftIcon={<FaInfoCircle />}
                variant="outline"
                ariaLabel="More information"
                onClick={() => handleClick('More info')}
              />
              <Button 
                iconOnly 
                leftIcon={<FaExclamationTriangle />}
                variant="warning"
                ariaLabel="Warning"
                onClick={() => handleClick('Warning')}
              />
            </div>
          </section>

          {/* Section 4: Loading States */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">
              4. Loading States
            </h2>
            <div className="flex flex-wrap gap-4 items-center">
              <Button loading>
                Processing...
              </Button>
              <Button loading leftIcon={<FaSpinner />}>
                Saving...
              </Button>
              <Button loading iconOnly ariaLabel="Loading" />
              <Button loading variant="outline">
                Submitting...
              </Button>
              <Button loading variant="danger">
                Deleting...
              </Button>
            </div>
          </section>

          {/* Section 5: Disabled States */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">
              5. Disabled States
            </h2>
            <div className="flex flex-wrap gap-4 items-center">
              <Button disabled onClick={() => handleClick('This should not fire')}>
                Can't click
              </Button>
              <Button disabled leftIcon={<FaFacebook />}>
                Already Connected
              </Button>
              <Button disabled variant="outline">
                Not Available
              </Button>
              <Button disabled iconOnly leftIcon={<FaTimes />} ariaLabel="Close (disabled)" />
            </div>
          </section>

          {/* Section 6: Different Sizes */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">
              6. Different Sizes
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Regular Buttons</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button size="sm">Small Button</Button>
                  <Button size="md">Medium Button</Button>
                  <Button size="lg">Large Button</Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Icon-only Buttons</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button size="sm" iconOnly leftIcon={<FaTimes />} ariaLabel="Small close" />
                  <Button size="md" iconOnly leftIcon={<FaTimes />} ariaLabel="Medium close" />
                  <Button size="lg" iconOnly leftIcon={<FaTimes />} ariaLabel="Large close" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Buttons with Icons</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button size="sm" leftIcon={<FaFacebook />}>Small</Button>
                  <Button size="md" leftIcon={<FaFacebook />}>Medium</Button>
                  <Button size="lg" leftIcon={<FaFacebook />}>Large</Button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7: Full Width */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">
              7. Full Width Buttons
            </h2>
            <div className="space-y-4 max-w-2xl">
              <Button fullWidth onClick={() => handleClick('Full Width Primary')}>
                Full Width Primary Button
              </Button>
              <Button fullWidth variant="outline" onClick={() => handleClick('Full Width Outline')}>
                Full Width Outline Button
              </Button>
              <Button fullWidth leftIcon={<FaDownload />} onClick={() => handleClick('Download All')}>
                Download All Files
              </Button>
            </div>
          </section>

          {/* Section 8: Submit & Form Buttons */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">
              8. Submit & Form Buttons
            </h2>
            <div className="space-y-6 max-w-md">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Form submitted!');
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit">Submit Form</Button>
                  <Button type="reset" variant="outline">Reset</Button>
                </div>
              </form>
            </div>
          </section>

          {/* Section 9: Link Buttons */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">
              9. Link Buttons
            </h2>
            <div className="flex flex-wrap gap-4 items-center">
              <Button href="/dashboard">
                Open Dashboard
              </Button>
              <Button href="/dashboard" target="_blank" rightIcon={<FaArrowRight />}>
                Open in New Tab
              </Button>
              <Button href="/docs" variant="outline">
                View Documentation
              </Button>
            </div>
          </section>

          {/* Section 10: Custom Classes */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">
              10. Custom Classes
            </h2>
            <div className="flex flex-wrap gap-4 items-center">
              <Button className="rounded-full shadow-lg">
                Rounded Button
              </Button>
              <Button className="rounded-lg shadow-xl hover:shadow-2xl transition-shadow">
                Shadow Hover
              </Button>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                Gradient Button
              </Button>
              <Button className="animate-pulse bg-indigo-600">
                Pulsing Button
              </Button>
            </div>
          </section>

          {/* Section 11: Social Media Buttons */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">
              11. Social Media Buttons
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Icon-only Social Buttons</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button 
                    iconOnly 
                    leftIcon={<FaFacebook />}
                    className="bg-blue-600 hover:bg-blue-700"
                    ariaLabel="Facebook"
                    onClick={() => handleClick('Facebook')}
                  />
                  <Button 
                    iconOnly 
                    leftIcon={<FaTwitter />}
                    className="bg-sky-500 hover:bg-sky-600"
                    ariaLabel="Twitter"
                    onClick={() => handleClick('Twitter')}
                  />
                  <Button 
                    iconOnly 
                    leftIcon={<FaInstagram />}
                    className="bg-pink-600 hover:bg-pink-700"
                    ariaLabel="Instagram"
                    onClick={() => handleClick('Instagram')}
                  />
                  <Button 
                    iconOnly 
                    leftIcon={<FaYoutube />}
                    className="bg-red-600 hover:bg-red-700"
                    ariaLabel="YouTube"
                    onClick={() => handleClick('YouTube')}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Social Buttons with Labels</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button 
                    leftIcon={<FaFacebook />}
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleClick('Share on Facebook')}
                  >
                    Share on Facebook
                  </Button>
                  <Button 
                    leftIcon={<FaTwitter />}
                    className="bg-sky-500 hover:bg-sky-600"
                    onClick={() => handleClick('Tweet')}
                  >
                    Tweet This
                  </Button>
                  <Button 
                    leftIcon={<FaInstagram />}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    onClick={() => handleClick('Instagram')}
                  >
                    Instagram
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 12: Usage with Constants */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">
              12. Usage with Constants
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                Using constants for social media buttons:
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { name: 'Facebook', icon: FaFacebook, color: 'bg-blue-600 hover:bg-blue-700' },
                  { name: 'Twitter', icon: FaTwitter, color: 'bg-sky-500 hover:bg-sky-600' },
                  { name: 'Instagram', icon: FaInstagram, color: 'bg-pink-600 hover:bg-pink-700' },
                  { name: 'YouTube', icon: FaYoutube, color: 'bg-red-600 hover:bg-red-700' },
                ].map((social) => (
                  <Button
                    key={social.name}
                    iconOnly
                    leftIcon={<social.icon />}
                    className={social.color}
                    ariaLabel={`Follow us on ${social.name}`}
                    onClick={() => handleClick(social.name)}
                  />
                ))}
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t text-center text-gray-500">
          <p>Button Component Showcase • Built with React & Tailwind CSS</p>
          <p className="text-sm mt-2">Click any button to see it in action!</p>
        </footer>
      </div>
    </div>
  );
}