require('ts-node').register({ files: true });
const path = require(`path`);
var fs = require('fs');
var dir = './.cache/caches/gatsby-source-prismic-graphql';

exports.onPreBootstrap = () => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

/** @type { import("gatsby").GatsbyNode["createPages"] } */
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return graphql(`
    {
      allShopifyProduct {
        edges {
          node {
            handle
          }
        }
      }

      allShopifyCollection {
        edges {
          node {
            handle
          }
        }
      }

      prismic {
        allBlog_content_models {
          edges {
            node {
              post_title
              release_date
              _linkType
              body {
                ... on PRISMIC_Blog_content_modelBodyDynamic_content {
                  type
                  label
                }
                ... on PRISMIC_Blog_content_modelBodyImage {
                  type
                  label
                }
                ... on PRISMIC_Blog_content_modelBodyShopify_store {
                  type
                  label
                  primary {
                    shopify_store
                  }
                }
              }
            }
          }
        }
      }

    }
  `).then((result) => {
    result.data.allShopifyProduct.edges.forEach(({ node }) => {
      createPage({
        path: `/product/${node.handle}/`,
        component: path.resolve(`./src/templates/product-page.tsx`),
        context: {
          handle: node.handle,
        },
      });
    });
    result.data.allShopifyCollection.edges.forEach(({ node }) => {
      createPage({
        path: `/collection/${node.handle}/`,
        component: path.resolve(`./src/templates/category-page.tsx`),
        context: {
          handle: node.handle,
        },
      });
    });
    result.data.allShopifyCollection.edges.forEach(({ node }) => {
      createPage({
        path: `modern/collection/${node.handle}/`,
        component: path.resolve(`./src/templates/category-page-sidebar.tsx`),
        context: {
          handle: node.handle,
        },
      });
    });
    result.data.allShopifyCollection.edges.forEach(({ node }) => {
      createPage({
        path: `minimal/collection/${node.handle}/`,
        component: path.resolve(`./src/templates/minimal-category-page.tsx`),
        context: {
          handle: node.handle,
        },
      });
    });
      result.data.allBlog_content_models.edges.forEach(({ node }) => {
        createPage({
          path: `/blog/${node.uid}/`,
          component: path.resolve(`./src/templates/blog.tsx`),
          context: {
            uid: node.uid,
          },
        });
      });
  });
};
