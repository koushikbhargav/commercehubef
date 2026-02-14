import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { StoreData } from './store';
import { snapshotTemplate } from './templates/snapshot';
import { shopifyTemplate } from './templates/shopify';
import { woocommerceTemplate } from './templates/woocommerce';

export const generateAndDownloadServer = async (store: StoreData) => {
  const zip = new JSZip();

  let template;

  // Select Template based on Platform/Source
  if (store.platform === 'shopify') {
    template = shopifyTemplate(store);
  } else if (store.platform === 'woocommerce') {
    template = woocommerceTemplate(store);
  } else {
    // Default to Snapshot for Custom API, Google Sheets, CSV, Manual
    template = snapshotTemplate(store);

    // For Snapshot servers, we also need to write the data file
    zip.file("data/inventory.json", JSON.stringify(store.inventory, null, 2));
  }

  // Write common files
  zip.file("package.json", JSON.stringify(template.packageJson, null, 2));
  zip.file("README.md", template.readme);
  zip.file("index.js", template.indexJs);

  // If the template provided extra files (like scripts), write them
  // This is a future-proof hook, currently our templates only return the 3 main files

  // Generate Zip
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${store.name.toLowerCase().replace(/\s+/g, '-')}-mcp-server.zip`);
};
