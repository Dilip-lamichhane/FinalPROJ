const express = require('express');
const { getSupabaseClient } = require('../config/supabase');

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase is not configured' });
    }

    const { error } = await supabase.from('shops').select('id').limit(1);
    if (error) {
      return res.status(500).json({ error: 'Failed to connect to Supabase' });
    }

    return res.json({ status: 'OK', supabase: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to connect to Supabase' });
  }
});

router.get('/shops', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase is not configured' });
    }

    const { limit = 50, offset = 0, category, product } = req.query;
    const normalizedProduct = String(product || '').trim();

    if (normalizedProduct) {
      const { data: productRows, error: productError } = await supabase
        .from('products')
        .select('shop_id')
        .ilike('name', `%${normalizedProduct}%`)
        .limit(5000);

      if (productError) {
        return res.status(500).json({ error: 'Failed to search products in Supabase' });
      }

      const shopIds = Array.from(
        new Set((productRows || []).map((row) => row.shop_id).filter((id) => id != null))
      );

      if (shopIds.length === 0) {
        return res.json({ shops: [] });
      }

      let shopsQuery = supabase.from('shops').select('*').in('id', shopIds);
      if (category) {
        shopsQuery = shopsQuery.eq('category', category);
      }

      const { data, error } = await shopsQuery
        .order('id', { ascending: true })
        .range(Number(offset), Number(offset) + Number(limit) - 1);

      if (error) {
        return res.status(500).json({ error: 'Failed to fetch filtered shops from Supabase' });
      }

      return res.json({ shops: data || [] });
    }

    let shopsQuery = supabase.from('shops').select('*');
    if (category) {
      shopsQuery = shopsQuery.eq('category', category);
    }

    const { data, error } = await shopsQuery
      .order('id', { ascending: true })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch shops from Supabase' });
    }

    return res.json({ shops: data || [] });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch shops from Supabase' });
  }
});

router.get('/shops/:shopId/products', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase is not configured' });
    }

    const shopId = Number(req.params.shopId);
    if (!Number.isFinite(shopId)) {
      return res.status(400).json({ error: 'Invalid shop ID' });
    }

    const query = String(req.query.q || '').trim();

    let productsQuery = supabase.from('products').select('*').eq('shop_id', shopId);
    if (query) {
      productsQuery = productsQuery.ilike('name', `%${query}%`);
    }

    const { data, error } = await productsQuery.order('name', { ascending: true }).limit(5000);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch products from Supabase' });
    }

    return res.json({ products: data || [] });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch products from Supabase' });
  }
});

module.exports = router;
