# Shopify Setup Guide
# Task 13: Shopify Migration - Complete Setup Instructions

## Quick Start: 5-Minute Setup

### 1. Create Shopify Store
1. Go to [shopify.com](https://www.shopify.com) and create a new store
2. Choose "Start free trial" 
3. Store name: `harmony-farm-sanctuary` (or your preferred name)
4. Complete the setup wizard

### 2. Enable Storefront API
1. In Shopify Admin, go to **Apps > Manage private apps**
2. Click **Create private app**
3. App name: `Harmony Farm Website`
4. Enable **Storefront API** 
5. Check these permissions:
   - `Read products, variants and collections`
   - `Read customer tags`
   - `Read inventory of products and their variants`
6. Click **Save**
7. Copy the **Storefront access token**

### 3. Configure Environment
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update your `.env` file:
   ```env
   VITE_SHOPIFY_DOMAIN=your-store-name.myshopify.com
   VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
   ```

### 4. Add Sample Products
Upload these sanctuary-themed products to test:

**1. "Team Bella" Pig Sanctuary Hoodie**
- Product type: Apparel
- Price: $49.99
- Compare at price: $59.99
- Tags: featured, apparel, pig, bella
- Variants: Small, Medium, Large, XL

**2. Harmony Farm Classic T-Shirt**
- Product type: Apparel  
- Price: $24.99
- Tags: apparel, classic, sanctuary
- Variants: Small, Medium, Large, XL

**3. Sanctuary Life Guide Book**
- Product type: Books
- Price: $29.99
- Tags: books, education, guide
- No variants

### 5. Test Integration
1. Start development server:
   ```bash
   npm run dev
   ```

2. Visit test page: `http://localhost:5173/shopify-test`

3. Verify:
   - ✅ Products load from Shopify
   - ✅ Search works
   - ✅ Filters work
   - ✅ Cart functionality works

## Detailed Setup Instructions

### Shopify Store Configuration

#### 1. Store Settings
**Location**: Settings > General
- Store name: Harmony Farm Sanctuary
- Store address: Add sanctuary address
- Currency: USD
- Time zone: Set to sanctuary location

#### 2. Payment Providers
**Location**: Settings > Payments
- Enable Shopify Payments (or preferred gateway)
- Configure tax settings for your state
- Set up abandoned checkout recovery

#### 3. Shipping Setup
**Location**: Settings > Shipping
- Create shipping zones (Local, Domestic, International)
- Set shipping rates:
  - Free shipping over $50
  - Standard shipping $5.99
  - Express shipping $12.99

#### 4. Product Collections
Create these collections for organization:
- **Featured Products** (automatic, tag: featured)
- **Apparel** (automatic, product type: Apparel)
- **Accessories** (automatic, product type: Accessories)
- **Books & Education** (automatic, product type: Books)
- **Gifts** (automatic, product type: Gifts)

### Product Setup Guide

#### Product Template
Use this template for all sanctuary products:

**Title**: [Product Name]
**Description**: Detailed product description with sanctuary story
**Product type**: One of: Apparel, Accessories, Books, Gifts, Seasonal
**Vendor**: Harmony Farm Sanctuary
**Tags**: Add relevant tags (featured, category, animal names, etc.)

**SEO Settings**:
- Page title: Include product name and "Harmony Farm Sanctuary"
- Meta description: Brief, compelling description

**Images**:
- Main image: High-quality product photo
- Additional: Lifestyle shots, detail views
- Alt text: Descriptive for accessibility

#### Variant Setup
For apparel products:
- **Size**: Small, Medium, Large, XL, XXL
- **Color**: If applicable
- **Style**: If multiple styles available

### API Configuration

#### Storefront API Permissions
Enable these permissions for your private app:

**Required**:
- `unauthenticated_read_product_listings`
- `unauthenticated_read_product_inventory`
- `unauthenticated_read_collection_listings`
- `unauthenticated_write_checkouts`
- `unauthenticated_read_checkouts`

**Optional** (for advanced features):
- `unauthenticated_read_product_tags`
- `unauthenticated_read_selling_plans`

#### GraphQL Playground
Test your API access:
1. Go to your private app settings
2. Copy the Storefront access token
3. Test queries at: https://[your-store].myshopify.com/api/graphql

## Development Workflow

### 1. Local Development
```bash
# Install dependencies (already done)
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Shopify credentials

# Start development server
npm run dev

# Visit test pages
# - Local components: http://localhost:5173/store-test
# - Shopify integration: http://localhost:5173/shopify-test
```

### 2. Testing Components

#### Component Test Page (`/store-test`)
- Tests components with local sample data
- Good for UI/UX development
- No Shopify connection required

#### Shopify Test Page (`/shopify-test`)
- Tests full Shopify integration
- Real API calls and data
- Requires valid Shopify credentials

### 3. Adding Products
When adding products to Shopify:

1. **Use consistent product types** to match our categories
2. **Add meaningful tags** for filtering
3. **Set featured status** with `featured` tag
4. **Use proper pricing** (price vs compare_at_price for sales)
5. **Add high-quality images** with descriptive alt text

### 4. Customizing Categories
Update category mapping in `src/utils/shopifyAdapters.ts`:

```typescript
const mapProductTypeToCategory = (productType: string): ProductCategory => {
  const type = productType.toLowerCase()
  // Add your custom mapping logic here
  if (type.includes('your-custom-type')) {
    return 'your-category'
  }
  // ... existing mappings
}
```

## Troubleshooting

### Common Issues

#### 1. "Products not loading"
**Causes**:
- Invalid Storefront access token
- Incorrect domain format
- API permissions not enabled

**Solutions**:
- Verify environment variables
- Check Shopify private app settings
- Test API access in GraphQL playground

#### 2. "CORS errors"
**Cause**: Missing Storefront API permissions

**Solution**: 
- Enable all required Storefront API permissions
- Regenerate access token if needed

#### 3. "Cart not working"
**Cause**: Checkout permissions not enabled

**Solution**:
- Enable `unauthenticated_write_checkouts`
- Enable `unauthenticated_read_checkouts`

#### 4. "Search not finding products"
**Cause**: Products not published to Storefront API

**Solution**:
- In product settings, ensure "Available to" includes "Online Store"
- Check product availability in Storefront API

### Debug Tools

#### 1. Console Logging
The integration includes extensive console logging:
- Open browser DevTools > Console
- Look for Shopify API calls and responses
- Check for error messages

#### 2. Network Tab
Monitor API calls:
- DevTools > Network tab
- Filter by "graphql"
- Inspect request/response data

#### 3. Test Queries
Use GraphQL playground to test queries:
```graphql
{
  products(first: 5) {
    edges {
      node {
        id
        title
        handle
        available
      }
    }
  }
}
```

## Migration Benefits

### Before (Custom Store)
- ❌ Need to build entire backend
- ❌ Payment processing setup
- ❌ Security compliance
- ❌ Inventory management
- ❌ Order fulfillment system
- ❌ Customer accounts
- ❌ Analytics and reporting

### After (Shopify Integration)
- ✅ Professional e-commerce backend
- ✅ Multiple payment options
- ✅ PCI compliance included
- ✅ Inventory tracking built-in
- ✅ Order management system
- ✅ Customer portal
- ✅ Rich analytics dashboard
- ✅ Mobile-optimized checkout
- ✅ Abandoned cart recovery
- ✅ SEO optimization tools

## Next Steps

### Immediate (Week 1)
1. Set up Shopify store with sanctuary products
2. Configure payment and shipping
3. Test full purchase flow

### Short Term (Week 2-3)
1. Integrate Shopify into existing store pages
2. Update navigation to use Shopify collections
3. Implement proper product page routing

### Long Term (Month 2+)
1. Advanced features (customer accounts, reviews)
2. Marketing integrations (email, social)
3. Analytics and optimization

## Support

### Resources
- [Shopify Storefront API Docs](https://shopify.dev/docs/storefront-api)
- [Shopify GraphQL Reference](https://shopify.dev/docs/storefront-api/reference)
- [Shopify Buy SDK](https://shopify.github.io/js-buy-sdk/)

### Code Structure
- **API Client**: `src/utils/shopify.ts`
- **Data Adapters**: `src/utils/shopifyAdapters.ts`
- **React Hooks**: `src/hooks/useShopify.ts`
- **Type Definitions**: `src/types/shopify.ts`
- **Test Pages**: `src/components/store/ShopifyTestPage.tsx`

**Ready to launch your sanctuary's e-commerce store! 🛍️🐾**