<template>
  <div class="w-full">
    <!-- Hero Section -->
    <section id="home" class="relative bg-gradient-to-r from-teal-600 to-teal-800 text-white py-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">Find Your Perfect Ride for Any Journey</h1>
          <p class="text-xl opacity-90 mb-8">AI-powered vehicle rentals and tours with transparent pricing and trusted service.</p>
          <div class="flex flex-wrap justify-center gap-4">
            <RouterLink to="/register">
              <AppButton size="lg">Get Started</AppButton>
            </RouterLink>
            <a href="#tours">
              <AppButton variant="outline" size="lg" class="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Explore Tours
              </AppButton>
            </a>
          </div>
        </div>
        <div class="relative z-10 mt-8">
          <SearchForm />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-16 bg-gray-50 dark:bg-gray-900">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Ride Hive</h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our AI-powered platform makes vehicle rentals and tour bookings simple, transparent, and reliable.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="feature in features" :key="feature.title" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div class="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <component :is="feature.icon" class="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section id="about" class="py-16 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            At Ride Hive, we're on a mission to make vehicle rentals and tour bookings more accessible, transparent, and enjoyable.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-16">
          <div>
            <img
              src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Team working together"
              class="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Ride Hive was founded in 2023 by a team of travel enthusiasts and technology experts who saw an opportunity to improve the vehicle rental experience.
            </p>
            <p class="text-gray-600 dark:text-gray-400">
              Today, Ride Hive connects thousands of travelers with vehicle owners and tour operators across the globe, powered by cutting-edge AI technology.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-16 bg-gray-50 dark:bg-gray-800">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Core Values</h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">These principles guide everything we do at Ride Hive.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="value in coreValues" :key="value.title" class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
            <div class="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <component :is="value.icon" class="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ value.title }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section id="team" class="py-16 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Team</h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">The passionate people behind Ride Hive.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="member in teamMembers" :key="member.name" class="text-center">
            <img :src="member.avatar" :alt="member.name" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ member.name }}</h3>
            <p class="text-teal-600 dark:text-teal-400 mb-2">{{ member.role }}</p>
            <p class="text-gray-600 dark:text-gray-400 text-sm">{{ member.bio }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Vehicles -->
    <section id="vehicles" class="py-16 bg-gray-50 dark:bg-gray-800">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Featured Vehicles</h2>
          <a href="#vehicles" class="text-teal-600 hover:text-teal-800 dark:hover:text-teal-400 font-medium">View All →</a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <VehicleCard v-for="vehicle in featuredVehicles" :key="vehicle.id" v-bind="vehicle" />
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="testimonials" class="py-16 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Our Customers Say</h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Don't take our word for it — hear from our satisfied customers.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="testimonial in testimonials" :key="testimonial.id" class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-4">
              <img :src="testimonial.avatar" :alt="testimonial.name" class="h-12 w-12 rounded-full mr-4" />
              <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">{{ testimonial.name }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ testimonial.role }}</p>
              </div>
            </div>
            <p class="text-gray-700 dark:text-gray-300 italic">"{{ testimonial.content }}"</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section id="tours" class="py-16 bg-teal-600 text-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto opacity-90">Join Ride Hive today and experience the future of vehicle rentals and tour bookings.</p>
        <div class="flex flex-wrap justify-center gap-4">
          <RouterLink to="/register">
            <AppButton size="lg" class="bg-white text-teal-600 hover:bg-gray-100">Sign Up Now</AppButton>
          </RouterLink>
          <a href="#about">
            <AppButton variant="outline" size="lg" class="border-white text-white hover:bg-teal-700">Learn More</AppButton>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { TrendingUp, ShieldCheck, Users, Map } from 'lucide-vue-next'
import AppButton from '../components/ui/AppButton.vue'
import SearchForm from '../components/ui/SearchForm.vue'
import VehicleCard from '../components/ui/VehicleCard.vue'

const features = [
  { title: 'AI-Powered Pricing', description: 'Get the best rates with our dynamic pricing algorithm that adjusts to market conditions.', icon: TrendingUp },
  { title: 'Trusted Rentals', description: 'All vehicles undergo rigorous inspection and cleaning before each rental.', icon: ShieldCheck },
  { title: 'Community Marketplace', description: 'Join thousands of travelers and vehicle owners in our trusted community.', icon: Users },
  { title: 'Guided Tours', description: 'Discover new destinations with our curated selection of guided tours.', icon: Map },
]

const coreValues = [
  { title: 'Innovation', description: 'We constantly push the boundaries of what\'s possible with AI and technology.', icon: TrendingUp },
  { title: 'Trust', description: 'We build relationships based on reliability, transparency, and security.', icon: ShieldCheck },
  { title: 'Community', description: 'We foster a diverse and inclusive marketplace that benefits everyone.', icon: Users },
  { title: 'Adventure', description: 'We empower people to explore the world with confidence and excitement.', icon: Map },
]

const teamMembers = [
  { name: 'Sarah Johnson', role: 'CEO & Co-founder', bio: 'Former tech executive with a passion for travel and sustainability.', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' },
  { name: 'Michael Chen', role: 'CTO & Co-founder', bio: 'AI expert with background in building marketplace platforms.', avatar: 'https://randomuser.me/api/portraits/men/42.jpg' },
  { name: 'Aisha Patel', role: 'COO', bio: 'Operations specialist with experience in the travel industry.', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { name: 'David Rodriguez', role: 'Head of Product', bio: 'Product designer focused on creating intuitive user experiences.', avatar: 'https://randomuser.me/api/portraits/men/29.jpg' },
]

const featuredVehicles = [
  { id: '1', name: 'Tesla Model 3', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=2071&q=80', type: 'Electric', price: 89, rating: 4.9, seats: 5, isAI: true, isElectric: true },
  { id: '2', name: 'Jeep Wrangler', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=2070&q=80', type: 'SUV', price: 75, rating: 4.7, seats: 5, isAI: false, isElectric: false },
  { id: '3', name: 'BMW 3 Series', image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=2064&q=80', type: 'Luxury', price: 110, rating: 4.8, seats: 5, isAI: false, isElectric: false },
  { id: '4', name: 'Ford Mustang', image: 'https://images.unsplash.com/photo-1584345604476-8ec5f82d718c?auto=format&fit=crop&w=2070&q=80', type: 'Convertible', price: 95, rating: 4.6, seats: 4, isAI: true, isElectric: false },
]

const testimonials = [
  { id: '1', name: 'Alex Johnson', role: 'Business Traveler', content: 'Ride Hive made my business trip seamless. The AI pricing was fair and the vehicle was exactly what I needed.', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: '2', name: 'Sarah Williams', role: 'Family Vacation', content: 'We booked an SUV for our family vacation and it was perfect! The check-in process was quick and the vehicle was clean.', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: '3', name: 'Michael Chen', role: 'Tour Guide', content: 'As a tour operator, I rely on Ride Hive for my fleet needs. Their management system has saved me countless hours.', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
]
</script>
