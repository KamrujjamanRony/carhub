const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const storePath = path.join(__dirname, '../data/legacy-store.json');

const statusLookup = {
    pending: 0,
    processing: 1,
    shipped: 2,
    delivered: 3,
    cancelled: 4
};

function ensureStoreFile() {
    const directory = path.dirname(storePath);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    if (!fs.existsSync(storePath)) {
        fs.writeFileSync(storePath, JSON.stringify({
            siteSettings: [],
            categories: [],
            brands: [],
            menus: [],
            users: [],
            ecommerceUsers: [],
            products: [],
            carts: [],
            wishlists: [],
            orders: []
        }, null, 2));
    }
}

function readStore() {
    ensureStoreFile();
    return JSON.parse(fs.readFileSync(storePath, 'utf8'));
}

function writeStore(store) {
    fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
}

function nextId(items) {
    return items.reduce((maxId, item) => {
        const currentId = Number(item.id) || 0;
        return currentId > maxId ? currentId : maxId;
    }, 0) + 1;
}

function normalizeText(value) {
    return String(value || '').trim().toLowerCase();
}

function mapStatusToCode(value) {
    if (typeof value === 'number') {
        return value;
    }

    const normalized = normalizeText(value);
    return statusLookup[normalized] ?? 0;
}

function toLegacyOrderItem(item, index) {
    return {
        Id: item.id || index + 1,
        ProductId: item.productId,
        ProductName: item.productName || '',
        Quantity: Number(item.quantity) || 0,
        Price: Number(item.price) || 0,
        Size: item.size || '',
        Color: item.color || '',
        Image: item.image || ''
    };
}

function toLegacyOrder(order) {
    return {
        Id: order.id,
        UserId: order.userId,
        UserEmail: order.userEmail || '',
        UserName: order.userName || '',
        UserPhone: order.userPhone || '',
        OrderItems: {
            $values: (order.orderItems || []).map(toLegacyOrderItem)
        },
        Subtotal: Number(order.subtotal) || 0,
        DeliveryCharge: Number(order.deliveryCharge) || 0,
        TotalAmount: Number(order.totalAmount) || 0,
        PaymentMethod: order.paymentMethod || 'Cash on Delivery',
        OrderStatus: mapStatusToCode(order.orderStatus),
        ShippingAddress: {
            District: order.shippingAddress?.district || '',
            City: order.shippingAddress?.city || '',
            Street: order.shippingAddress?.street || '',
            Contact: order.shippingAddress?.contact || '',
            Type: order.shippingAddress?.type || ''
        },
        OrderDate: order.orderDate || new Date().toISOString(),
        DeliveredDate: order.deliveredDate || null
    };
}

function findEcommerceUser(store, id) {
    return store.ecommerceUsers.find((user) => (
        String(user.id) === String(id) || String(user.userId) === String(id)
    ));
}

function filterProducts(products, query) {
    const search = normalizeText(query.search);
    const category = normalizeText(query.category);
    const brand = normalizeText(query.brand);

    return products.filter((product) => {
        const searchMatch = !search || [
            product.name,
            product.shortDescription,
            product.description,
            product.brand,
            product.category,
            product.sku
        ].some((value) => normalizeText(value).includes(search));

        const categoryMatch = !category || normalizeText(product.category) === category;
        const brandMatch = !brand || normalizeText(product.brand) === brand;

        return searchMatch && categoryMatch && brandMatch;
    });
}

function updateCollectionItem(collection, id, update) {
    const itemIndex = collection.findIndex((item) => String(item.id) === String(id));
    if (itemIndex === -1) {
        return null;
    }

    collection[itemIndex] = {
        ...collection[itemIndex],
        ...update,
        id: collection[itemIndex].id
    };

    return collection[itemIndex];
}

function removeCollectionItem(collection, id) {
    const itemIndex = collection.findIndex((item) => String(item.id) === String(id));
    if (itemIndex === -1) {
        return false;
    }

    collection.splice(itemIndex, 1);
    return true;
}

router.get('/users', (req, res) => {
    const store = readStore();
    res.json(store.users);
});

router.get('/SiteSetting', (req, res) => {
    const store = readStore();
    res.json(store.siteSettings);
});

router.get('/SiteSetting/:id', (req, res) => {
    const store = readStore();
    const siteSetting = store.siteSettings.find((item) => String(item.id) === String(req.params.id));
    res.json(siteSetting || null);
});

router.post('/SiteSetting', (req, res) => {
    const store = readStore();
    const payload = {
        id: nextId(store.siteSettings),
        ...req.body
    };

    store.siteSettings.push(payload);
    writeStore(store);
    res.status(201).json(payload);
});

router.put('/SiteSetting/:id', (req, res) => {
    const store = readStore();
    const updated = updateCollectionItem(store.siteSettings, req.params.id, req.body);

    if (!updated) {
        return res.status(404).json({ message: 'Site setting not found' });
    }

    writeStore(store);
    res.json(updated);
});

router.delete('/SiteSetting/:id', (req, res) => {
    const store = readStore();
    const deleted = removeCollectionItem(store.siteSettings, req.params.id);

    if (!deleted) {
        return res.status(404).json({ message: 'Site setting not found' });
    }

    writeStore(store);
    res.json({ message: 'Site setting deleted successfully' });
});

router.get('/Category', (req, res) => {
    const store = readStore();
    res.json(store.categories);
});

router.post('/Category', (req, res) => {
    const store = readStore();
    const category = {
        id: nextId(store.categories),
        image: req.body.image || '/assets/images/category/category-1.jpg',
        ...req.body
    };

    store.categories.push(category);
    writeStore(store);
    res.status(201).json(category);
});

router.put('/Category/:id', (req, res) => {
    const store = readStore();
    const updated = updateCollectionItem(store.categories, req.params.id, req.body);

    if (!updated) {
        return res.status(404).json({ message: 'Category not found' });
    }

    writeStore(store);
    res.json(updated);
});

router.delete('/Category/:id', (req, res) => {
    const store = readStore();
    const deleted = removeCollectionItem(store.categories, req.params.id);

    if (!deleted) {
        return res.status(404).json({ message: 'Category not found' });
    }

    writeStore(store);
    res.json({ message: 'Category deleted successfully' });
});

router.get('/Brand', (req, res) => {
    const store = readStore();
    res.json(store.brands);
});

router.post('/Brand', (req, res) => {
    const store = readStore();
    const brand = {
        id: nextId(store.brands),
        ...req.body
    };

    store.brands.push(brand);
    writeStore(store);
    res.status(201).json(brand);
});

router.put('/Brand/:id', (req, res) => {
    const store = readStore();
    const updated = updateCollectionItem(store.brands, req.params.id, req.body);

    if (!updated) {
        return res.status(404).json({ message: 'Brand not found' });
    }

    writeStore(store);
    res.json(updated);
});

router.delete('/Brand/:id', (req, res) => {
    const store = readStore();
    const deleted = removeCollectionItem(store.brands, req.params.id);

    if (!deleted) {
        return res.status(404).json({ message: 'Brand not found' });
    }

    writeStore(store);
    res.json({ message: 'Brand deleted successfully' });
});

router.post('/Menu/SearchMenu', (req, res) => {
    const store = readStore();
    res.json(store.menus);
});

router.post('/Menu/GetById/:id', (req, res) => {
    const store = readStore();
    const menu = store.menus.find((item) => String(item.id) === String(req.params.id));
    res.json(menu || null);
});

router.get('/Menu/GenerateTreeData', (req, res) => {
    const store = readStore();
    res.json(store.menus);
});

router.post('/Menu', (req, res) => {
    const store = readStore();
    const menu = {
        id: nextId(store.menus),
        children: [],
        permissionsKey: [],
        isSelected: false,
        collapsed: true,
        ...req.body
    };

    store.menus.push(menu);
    writeStore(store);
    res.status(201).json(menu);
});

router.put('/Menu/EditMenu/:id', (req, res) => {
    const store = readStore();
    const updated = updateCollectionItem(store.menus, req.params.id, req.body);

    if (!updated) {
        return res.status(404).json({ message: 'Menu not found' });
    }

    writeStore(store);
    res.json(updated);
});

router.delete('/Menu/DeleteMenu', (req, res) => {
    const store = readStore();
    const deleted = removeCollectionItem(store.menus, req.query.id);

    if (!deleted) {
        return res.status(404).json({ message: 'Menu not found' });
    }

    writeStore(store);
    res.json({ message: 'Menu deleted successfully' });
});

router.get('/Product', (req, res) => {
    const store = readStore();
    res.json(store.products);
});

router.post('/Product/search', (req, res) => {
    const store = readStore();
    res.json(filterProducts(store.products, req.body || {}));
});

router.get('/Product/categories', (req, res) => {
    const store = readStore();
    const categories = [...new Set(store.products.map((product) => product.category).filter(Boolean))];
    res.json(categories);
});

router.get('/Product/brands', (req, res) => {
    const store = readStore();
    const brands = [...new Set(store.products.map((product) => product.brand).filter(Boolean))];
    res.json(brands);
});

router.get('/Product/:id', (req, res) => {
    const store = readStore();
    const product = store.products.find((item) => String(item.id) === String(req.params.id));
    res.json(product || null);
});

router.post('/Product', (req, res) => {
    const store = readStore();
    const product = {
        id: nextId(store.products),
        images: [],
        sizes: [],
        colors: [],
        ratings: [],
        specifications: [],
        relatedProducts: [],
        quantity: 1,
        availability: 'In stock',
        ...req.body
    };

    store.products.push(product);
    writeStore(store);
    res.status(201).json(product);
});

router.put('/Product/:id', (req, res) => {
    const store = readStore();
    const updated = updateCollectionItem(store.products, req.params.id, req.body);

    if (!updated) {
        return res.status(404).json({ message: 'Product not found' });
    }

    writeStore(store);
    res.json(updated);
});

router.delete('/Product/:id', (req, res) => {
    const store = readStore();
    const deleted = removeCollectionItem(store.products, req.params.id);

    if (!deleted) {
        return res.status(404).json({ message: 'Product not found' });
    }

    writeStore(store);
    res.json({ message: 'Product deleted successfully' });
});

router.get('/User', (req, res) => {
    const store = readStore();
    res.json(store.users);
});

router.post('/User', (req, res) => {
    const store = readStore();
    const user = {
        id: nextId(store.users),
        ...req.body
    };

    store.users.push(user);
    writeStore(store);
    res.status(201).json(user);
});

router.post('/User/SearchUser', (req, res) => {
    const store = readStore();
    const search = normalizeText(req.query.Search);

    if (!search) {
        return res.json(store.users);
    }

    const users = store.users.filter((user) => [
        user.name,
        user.email,
        user.role,
        user.phone
    ].some((value) => normalizeText(value).includes(search)));

    res.json(users);
});

router.put('/User/EditUser/:id', (req, res) => {
    const store = readStore();
    const updated = updateCollectionItem(store.users, req.params.id, req.body);

    if (!updated) {
        return res.status(404).json({ message: 'User not found' });
    }

    writeStore(store);
    res.json(updated);
});

router.delete('/User/DeleteUser', (req, res) => {
    const store = readStore();
    const deleted = removeCollectionItem(store.users, req.query.id);

    if (!deleted) {
        return res.status(404).json({ message: 'User not found' });
    }

    writeStore(store);
    res.json({ message: 'User deleted successfully' });
});

router.get('/ECommerceUser', (req, res) => {
    const store = readStore();
    res.json(store.ecommerceUsers);
});

router.get('/ECommerceUser/:id', (req, res) => {
    const store = readStore();
    const user = findEcommerceUser(store, req.params.id);
    res.json(user || null);
});

router.post('/ECommerceUser', (req, res) => {
    const store = readStore();
    const existingUser = store.ecommerceUsers.find((user) => (
        user.userId && user.userId === req.body.userId
    ));

    if (existingUser) {
        return res.status(200).send('User already exists');
    }

    const user = {
        id: nextId(store.ecommerceUsers),
        address: [],
        role: 'user',
        ...req.body
    };

    store.ecommerceUsers.push(user);
    writeStore(store);
    res.status(201).send('User created successfully');
});

router.put('/ECommerceUser/:id', (req, res) => {
    const store = readStore();
    const user = findEcommerceUser(store, req.params.id);

    if (!user) {
        return res.status(404).json({ message: 'E-commerce user not found' });
    }

    Object.assign(user, req.body, { id: user.id });
    writeStore(store);
    res.status(200).send('User updated successfully');
});

router.delete('/ECommerceUser/:id', (req, res) => {
    const store = readStore();
    const index = store.ecommerceUsers.findIndex((user) => (
        String(user.id) === String(req.params.id) || String(user.userId) === String(req.params.id)
    ));

    if (index === -1) {
        return res.status(404).json({ message: 'E-commerce user not found' });
    }

    store.ecommerceUsers.splice(index, 1);
    writeStore(store);
    res.status(200).send('User deleted successfully');
});

router.get('/Cart', (req, res) => {
    const store = readStore();
    res.json(store.carts);
});

router.get('/Cart/:userId', (req, res) => {
    const store = readStore();
    const carts = store.carts.filter((cart) => String(cart.userId) === String(req.params.userId));
    res.json(carts);
});

router.post('/Cart', (req, res) => {
    const store = readStore();
    const cart = {
        id: nextId(store.carts),
        userId: req.body.userId,
        products: req.body.products || []
    };

    store.carts.push(cart);
    writeStore(store);
    res.status(201).json(cart);
});

router.put('/Cart/:id', (req, res) => {
    const store = readStore();
    const updated = updateCollectionItem(store.carts, req.params.id, req.body);

    if (!updated) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    writeStore(store);
    res.status(200).send('Cart updated successfully');
});

router.delete('/Cart/:id', (req, res) => {
    const store = readStore();
    const deleted = removeCollectionItem(store.carts, req.params.id);

    if (!deleted) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    writeStore(store);
    res.status(200).send('Cart deleted successfully');
});

router.get('/Wishlist', (req, res) => {
    const store = readStore();
    res.json(store.wishlists);
});

router.get('/Wishlist/:userId', (req, res) => {
    const store = readStore();
    const wishlists = store.wishlists.filter((wishlist) => String(wishlist.userId) === String(req.params.userId));
    res.json(wishlists);
});

router.post('/Wishlist', (req, res) => {
    const store = readStore();
    const wishlist = {
        id: nextId(store.wishlists),
        userId: req.body.userId,
        products: req.body.products || []
    };

    store.wishlists.push(wishlist);
    writeStore(store);
    res.status(201).json(wishlist);
});

router.put('/Wishlist/:id', (req, res) => {
    const store = readStore();
    const updated = updateCollectionItem(store.wishlists, req.params.id, req.body);

    if (!updated) {
        return res.status(404).json({ message: 'Wishlist not found' });
    }

    writeStore(store);
    res.status(200).send('Wishlist updated successfully');
});

router.delete('/Wishlist/:id', (req, res) => {
    const store = readStore();
    const deleted = removeCollectionItem(store.wishlists, req.params.id);

    if (!deleted) {
        return res.status(404).json({ message: 'Wishlist not found' });
    }

    writeStore(store);
    res.status(200).send('Wishlist deleted successfully');
});

router.get('/Orders', (req, res) => {
    const store = readStore();
    res.json(store.orders.map(toLegacyOrder));
});

router.post('/Orders/searchOrder', (req, res) => {
    const store = readStore();
    const payload = req.body || {};
    const requestedStatus = payload.orderStatus;
    const fromDate = payload.fromDate ? new Date(payload.fromDate) : null;
    const toDate = payload.toDate ? new Date(payload.toDate) : null;

    const orders = store.orders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        const statusMatch = requestedStatus === undefined || requestedStatus === null || requestedStatus === '' || requestedStatus === 'null'
            ? true
            : mapStatusToCode(order.orderStatus) === mapStatusToCode(requestedStatus);
        const fromMatch = !fromDate || orderDate >= fromDate;
        const toMatch = !toDate || orderDate <= new Date(`${payload.toDate}T23:59:59.999Z`);

        return statusMatch && fromMatch && toMatch;
    });

    res.json(orders.map(toLegacyOrder));
});

router.get('/Orders/order/:orderId', (req, res) => {
    const store = readStore();
    const order = store.orders.find((item) => String(item.id) === String(req.params.orderId));
    res.json(order ? toLegacyOrder(order) : null);
});

router.post('/Orders', (req, res) => {
    const store = readStore();
    const order = {
        id: nextId(store.orders),
        userId: req.body.userId || '',
        userEmail: req.body.userEmail || '',
        userName: req.body.userName || '',
        userPhone: req.body.userPhone || '',
        orderItems: (req.body.orderItems || []).map((item, index) => ({
            id: item.id || index + 1,
            productId: item.productId,
            productName: item.productName || '',
            quantity: Number(item.quantity) || 1,
            price: Number(item.price) || 0,
            size: item.size || '',
            color: item.color || '',
            image: item.image || ''
        })),
        subtotal: Number(req.body.subtotal) || 0,
        deliveryCharge: Number(req.body.deliveryCharge) || 0,
        totalAmount: Number(req.body.totalAmount) || 0,
        paymentMethod: req.body.paymentMethod || 'Cash on Delivery',
        orderStatus: mapStatusToCode(req.body.orderStatus),
        shippingAddress: {
            district: req.body.shippingAddress?.district || '',
            city: req.body.shippingAddress?.city || '',
            street: req.body.shippingAddress?.street || '',
            contact: req.body.shippingAddress?.contact || '',
            type: req.body.shippingAddress?.type || ''
        },
        orderDate: req.body.orderDate || new Date().toISOString(),
        deliveredDate: req.body.deliveredDate || null
    };

    store.orders.push(order);
    writeStore(store);
    res.status(201).json(toLegacyOrder(order));
});

router.get('/Orders/:userId', (req, res) => {
    const store = readStore();
    const orders = store.orders
        .filter((order) => String(order.userId) === String(req.params.userId))
        .map(toLegacyOrder);

    res.json({ $values: orders });
});

router.put('/Orders/status/:id', (req, res) => {
    const store = readStore();
    const order = store.orders.find((item) => String(item.id) === String(req.params.id));

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = mapStatusToCode(req.body.orderStatus);
    order.deliveredDate = req.body.deliveredDate || (order.orderStatus === 3 ? new Date().toISOString() : order.deliveredDate);
    writeStore(store);
    res.json(toLegacyOrder(order));
});

router.put('/Orders/:id', (req, res) => {
    const store = readStore();
    const order = store.orders.find((item) => String(item.id) === String(req.params.id));

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    Object.assign(order, req.body, { id: order.id });
    if (req.body.orderStatus !== undefined) {
        order.orderStatus = mapStatusToCode(req.body.orderStatus);
    }
    writeStore(store);
    res.json(toLegacyOrder(order));
});

router.delete('/Orders/:id', (req, res) => {
    const store = readStore();
    const deleted = removeCollectionItem(store.orders, req.params.id);

    if (!deleted) {
        return res.status(404).json({ message: 'Order not found' });
    }

    writeStore(store);
    res.status(200).send('Order deleted successfully');
});

module.exports = router;
