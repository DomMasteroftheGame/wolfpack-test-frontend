# Build Your Wolfpack PWA - Shopify Theme

This directory contains the Shopify theme files required to integrate the Build Your Wolfpack PWA game with a Shopify store.

## Directory Structure

- `layout/`: Contains theme.liquid and other layout files
- `templates/`: Contains page templates including game.liquid
- `sections/`: Contains theme sections including game-portal.liquid
- `assets/`: Contains theme assets and PWA files
- `config/`: Contains theme settings

## Installation

1. Zip this entire directory
2. Upload to Shopify as a theme
3. Follow the instructions in SHOPIFY-INTEGRATION.md

## Customization

You can customize the game portal through the Shopify theme editor after installation:

- Change heading and description text
- Modify button text and colors
- Adjust portal positioning
- Configure game appearance

## Development

For local development:

1. Install the Shopify CLI
2. Configure the `config.yml` file in the root directory
3. Use `shopify theme serve` to preview changes locally
4. Use `shopify theme push` to deploy changes to your store
