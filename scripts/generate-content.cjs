const fs = require('fs');
const matter = require('gray-matter');

const collectionsMap = {
    pirith: "පිරිත්",
    mulikaVandanawa: "මූලික වන්දනාව"
} 

// Function to parse and convert a single Markdown file
function parseMarkdownFile(fileName) {
  try {
    const filePath = `${directoryPath}/${fileName}`;
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent); // Extract frontmatter and content

    // Clean content by removing leading/trailing whitespace and line breaks
    const cleanContent = content.trim().replace(/\r?\n|\r/g, ' '); // Replace line breaks with spaces
    
    const jsonData = {
      id: fileName.replace('.md', ''), // Remove file extension from ID (filename   .md)
      title: data.title,
      keywords: data.keywords ? data.keywords : [], // Ensure keywords are an array, even if absent
      collections: data.collections ? data.collections : [], // Ensure collections are an array, even if absent
      content: cleanContent,
    };
    // Optional fields for the list screens: a one-line note and recitation order.
    if (data.note) jsonData.note = data.note;
    // English name and a one-line English summary, used for search engines,
    // AI search (llms.txt) and the in-app search.
    if (data.english) {
      jsonData.english = data.english;
      const key = data.english.toLowerCase();
      if (!jsonData.keywords.some((k) => String(k).toLowerCase() === key)) jsonData.keywords.push(data.english);
    }
    if (data.about) jsonData.about = data.about;
    // Search result snippet: Sinhala first, then the English summary.
    jsonData.description = [
      `${data.title}${data.english ? ` (${data.english})` : ''} සම්පූර්ණ පාඨය සිංහලෙන්.`,
      data.note ? `${data.note}.` : '',
      data.about || '',
    ].filter(Boolean).join(' ');
    if (typeof data.order === 'number') jsonData.order = data.order;

    const outputFile = `${outputFilePath}/${fileName.replace('.md', '.json')}`;
    const jsonFileContent = `${JSON.stringify(jsonData, null, 2)}\n`

    writeFile(jsonFileContent, outputFile); // Write JSON with indentation
    delete jsonData.content;
    return jsonData;
  } catch (error) {
    console.error(`Error parsing file ${fileName}:`, error);
    return null; // Return null for failed parsing to handle potential errors
  }
}

// Function to process all Markdown files in a directory
function processMarkdownFiles(directoryPath, outputFilePath) {
  const files = fs.readdirSync(directoryPath, { withFileTypes: true });
  const menu = {articles: {}, collections: {}};

  for (const file of files) {
    if (file.isFile() && /\.md$/.test(file.name)) { // Check for Markdown files
      const articleData  = parseMarkdownFile(file.name);
      menu.articles[articleData.id] = articleData;

      for (const collection of articleData.collections) {
        if (!menu.collections[collection]) {
          menu.collections[collection] = {title: collectionsMap[collection], articles: []};
        }
        menu.collections[collection].articles.push(articleData.id);
      }
    }
  }

    writeFile(JSON.stringify(menu, null, 2), `${outputFilePath}/menu.json`);
}

function writeFile(string, filepath) {
    try {
        fs.writeFileSync(filepath, string); // Write JSON with indentation
        console.log(`Successfully converted Markdown files to JSON: ${filepath}`);
      } catch (error) {
        console.error(`Error writing JSON file:`, error);
      }
}

// Example usage
const directoryPath = './content'; // Replace with your directory path
const outputFilePath = './public/content'; // Replace with your desired output filename

processMarkdownFiles(directoryPath, outputFilePath);
