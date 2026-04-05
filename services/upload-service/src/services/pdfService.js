// ============================================
// PDF Service
// ============================================
// Extracts text from PDF resumes using pdf-parse

const pdfParse = require('pdf-parse');

class PdfService {
  /**
   * Extract text from PDF buffer
   * @param {Buffer} pdfBuffer - PDF file buffer
   * @returns {Promise<Object>} Extracted text and metadata
   */
  async extractText(pdfBuffer) {
    try {
      const data = await pdfParse(pdfBuffer);

      return {
        text: data.text,
        pages: data.numpages,
        info: data.info,
        metadata: data.metadata
      };

    } catch (error) {
      console.error('PDF Parse Error:', error);
      throw new Error('Failed to extract text from PDF. File might be corrupted or password-protected.');
    }
  }

  /**
   * Validate PDF file
   * @param {Buffer} pdfBuffer - PDF file buffer
   * @returns {Promise<boolean>} True if valid
   */
  async validatePdf(pdfBuffer) {
    try {
      // Try to parse - if it works, it's valid
      await pdfParse(pdfBuffer);
      return true;

    } catch (error) {
      return false;
    }
  }

  /**
   * Extract resume sections (basic parsing)
   * @param {string} text - Extracted PDF text
   * @returns {Object} Structured resume data
   */
  extractResumeSections(text) {
    // Basic section detection (can be improved with NLP)
    const sections = {
      hasEmail: /\S+@\S+\.\S+/.test(text),
      hasPhone: /\+?\d{10,}/.test(text),
      hasExperience: /experience|work history/i.test(text),
      hasEducation: /education|university|college|degree/i.test(text),
      hasSkills: /skills|technologies|expertise/i.test(text),
      wordCount: text.split(/\s+/).length
    };

    return sections;
  }

  /**
   * Calculate resume completeness score
   * @param {Object} sections - Resume sections
   * @returns {number} Score 0-100
   */
  calculateCompletenessScore(sections) {
    let score = 0;

    if (sections.hasEmail) score += 15;
    if (sections.hasPhone) score += 15;
    if (sections.hasExperience) score += 25;
    if (sections.hasEducation) score += 20;
    if (sections.hasSkills) score += 25;

    return score;
  }
}

module.exports = new PdfService();
