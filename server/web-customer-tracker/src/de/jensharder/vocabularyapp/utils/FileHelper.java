package de.jensharder.vocabularyapp.utils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import de.jensharder.vocabularyapp.model.Card;

public class FileHelper {

	public static byte[] genPdfFromCards(List<Card> cards) {
		byte[] contents = null;
		try {
			// TODO generate file
			// Creating PDF document object

			PDDocument document = new PDDocument();
			final int rows = cards.size();
			int rowCounter = 0;
			int pageCounter = 0;

			while (rowCounter < rows) {

				PDPage page = new PDPage();
				document.addPage(page);
				pageCounter++;

				final float margin = 25.0f;
				// final float y = 700.0f;
				final float y = page.getMediaBox().getHeight() - 2.0f * margin;
				final int cols = 2;
				final float rowHeight = 20.0f;
				final float tableWidth = page.getMediaBox().getWidth() - 2.0f * margin;
				// final float tableHeight = rowHeight * (float) rows;
				final float colWidth = tableWidth / (float) cols;

				PDPageContentStream contentStream = new PDPageContentStream(document, page);

				// first page... insert header
				if (rowCounter == 0) {

				}

				// draw the rows
				float nexty = y;
				int rowsOnThisPage = -1;
				while (nexty > rowHeight + margin) {
					contentStream.moveTo(margin, nexty);
					contentStream.lineTo(margin + tableWidth, nexty);
					contentStream.stroke();
					nexty -= rowHeight;
					rowsOnThisPage++;
				}

				// draw the columns
				float nextx = margin;
				for (int i = 0; i <= cols; i++) {
					contentStream.moveTo(nextx, y);
					contentStream.lineTo(nextx, nexty + rowHeight);
					contentStream.stroke();
					nextx += colWidth;
				}

				// now add the text
				contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12.0f);

				final float cellMargin = 5.0f;
				float textx = margin + cellMargin;
				float texty = y - 15.0f;
				for (int i = 0; i < rowsOnThisPage; i++) {
					if (rowCounter >= cards.size()) {
						break;
					}
					Card card = cards.get(rowCounter);
					rowCounter++;

					String question = card.getQuestion();
					contentStream.beginText();
					contentStream.newLineAtOffset(textx, texty);
					contentStream.showText(question);
					contentStream.endText();
					textx += colWidth;

					String answer = card.getAnswer();
					contentStream.beginText();
					contentStream.newLineAtOffset(textx, texty);
					contentStream.showText(answer);
					contentStream.endText();
					textx += colWidth;

					texty -= rowHeight;
					textx = margin + cellMargin;
				}
				
				//pagecounter
				String pageNumber = "Page "+pageCounter;
				contentStream.beginText();
				contentStream.newLineAtOffset(margin, margin);
				contentStream.showText(pageNumber);
				contentStream.endText();

				contentStream.close();

			}

			// Saving the document
			document.save("my_doc.pdf");

			System.out.println("PDF created");

			// Closing the document
			document.close();

			Path path = Paths.get("my_doc.pdf");
			contents = Files.readAllBytes(path);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return contents;
	}

}
