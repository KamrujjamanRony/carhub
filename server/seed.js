const dotenv = require('dotenv');
const { sequelize } = require('./config/database');
const { User, Car, Review } = require('./models/associations');

dotenv.config();

async function seedData() {
    await sequelize.sync({ force: false });

    const users = [
        {
            name: 'Sagor Admin',
            email: 'sagor@gmail.com',
            password: '12345',
            role: 'admin',
            phone: '+8801700123456',
            isVerified: true
        },
        {
            name: 'Nadia Dealer',
            email: 'nadia.dealer@example.com',
            password: 'dealer123',
            role: 'dealer',
            phone: '+8801711123456',
            isVerified: true,
            dealerInfo: {
                company: 'Nadia Auto House',
                address: 'Bashundhara, Dhaka',
                licenseNumber: 'DLR-2026-001'
            }
        },
        {
            name: 'Rafi Seller',
            email: 'rafi.seller@example.com',
            password: 'seller123',
            role: 'seller',
            phone: '+8801722123456',
            isVerified: true
        },
        {
            name: 'Rashed Buyer',
            email: 'rashed.buyer@example.com',
            password: 'buyer123',
            role: 'buyer',
            phone: '+8801733123456',
            isVerified: true
        }
    ];

    const usersByEmail = {};
    for (const userData of users) {
        const [user] = await User.findOrCreate({
            where: { email: userData.email },
            defaults: userData
        });
        usersByEmail[user.email] = user;
    }

    const cars = [
        {
            title: '2022 Toyota Corolla Altis',
            description: 'Well-maintained sedan with low mileage and a clean interior.',
            brand: 'Toyota',
            model: 'Corolla Altis',
            year: 2022,
            price: 29500,
            mileage: 18000,
            fuelType: 'petrol',
            transmission: 'automatic',
            ownerType: 'first',
            images: [
                'https://example.com/images/corolla-front.jpg',
                'https://example.com/images/corolla-side.jpg'
            ],
            specifications: {
                color: 'Pearl White',
                seats: 5,
                engine: '1.8L',
                power: '139hp'
            },
            sellerType: 'dealer',
            location: { city: 'Dhaka', area: 'Gulshan', country: 'Bangladesh' },
            isAvailable: true,
            isFeatured: true,
            sellerEmail: 'nadia.dealer@example.com'
        },
        {
            title: '2021 Honda Civic RS',
            description: 'Sporty and reliable compact sedan with excellent service history.',
            brand: 'Honda',
            model: 'Civic RS',
            year: 2021,
            price: 32500,
            mileage: 22500,
            fuelType: 'petrol',
            transmission: 'automatic',
            ownerType: 'second',
            images: [
                'https://example.com/images/civic-front.jpg',
                'https://example.com/images/civic-rear.jpg'
            ],
            specifications: {
                color: 'Radiant Red',
                seats: 5,
                engine: '1.5L Turbo',
                power: '180hp'
            },
            sellerType: 'individual',
            location: { city: 'Chittagong', area: 'Pahartali', country: 'Bangladesh' },
            isAvailable: true,
            isFeatured: false,
            sellerEmail: 'rafi.seller@example.com'
        },
        {
            title: '2023 Nissan Leaf EV',
            description: 'Electric hatchback with long range and excellent battery health.',
            brand: 'Nissan',
            model: 'Leaf',
            year: 2023,
            price: 28500,
            mileage: 12000,
            fuelType: 'electric',
            transmission: 'automatic',
            ownerType: 'first',
            images: [
                'https://example.com/images/leaf-front.jpg',
                'https://example.com/images/leaf-interior.jpg'
            ],
            specifications: {
                color: 'Ocean Blue',
                seats: 5,
                battery: '40kWh',
                range: '270km'
            },
            sellerType: 'individual',
            location: { city: 'Sylhet', area: 'Zindabazar', country: 'Bangladesh' },
            isAvailable: true,
            isFeatured: true,
            sellerEmail: 'rafi.seller@example.com'
        }
    ];

    const carsByTitle = {};
    for (const carData of cars) {
        const seller = usersByEmail[carData.sellerEmail];
        if (!seller) continue;

        const findData = { title: carData.title };
        const defaults = {
            description: carData.description,
            brand: carData.brand,
            model: carData.model,
            year: carData.year,
            price: carData.price,
            mileage: carData.mileage,
            fuelType: carData.fuelType,
            transmission: carData.transmission,
            ownerType: carData.ownerType,
            images: carData.images,
            specifications: carData.specifications,
            sellerType: carData.sellerType,
            location: carData.location,
            isAvailable: carData.isAvailable,
            isFeatured: carData.isFeatured,
            sellerId: seller.id
        };

        const [car] = await Car.findOrCreate({ where: findData, defaults });
        carsByTitle[car.title] = car;
    }

    const reviews = [
        {
            userEmail: 'rashed.buyer@example.com',
            carTitle: '2022 Toyota Corolla Altis',
            rating: 5,
            comment: 'Great condition and smooth purchase process.',
            likes: 12,
            dislikes: 1
        },
        {
            userEmail: 'rashed.buyer@example.com',
            carTitle: '2021 Honda Civic RS',
            rating: 4,
            comment: 'Very reliable car with nice handling.',
            likes: 8,
            dislikes: 0
        },
        {
            userEmail: 'nadia.dealer@example.com',
            carTitle: '2023 Nissan Leaf EV',
            rating: 5,
            comment: 'Excellent electric vehicle and battery health.',
            likes: 15,
            dislikes: 0
        }
    ];

    for (const reviewData of reviews) {
        const user = usersByEmail[reviewData.userEmail];
        const car = carsByTitle[reviewData.carTitle];
        if (!user || !car) continue;

        await Review.findOrCreate({
            where: {
                userId: user.id,
                carId: car.id
            },
            defaults: {
                rating: reviewData.rating,
                comment: reviewData.comment,
                likes: reviewData.likes,
                dislikes: reviewData.dislikes
            }
        });
    }

    console.log('✅ Seed data created successfully.');
    console.log('Admin credentials: sagor@gmail.com / 12345');
}

seedData()
    .catch((error) => {
        console.error('Seed failed:', error);
        process.exit(1);
    })
    .finally(() => {
        sequelize.close();
    });
