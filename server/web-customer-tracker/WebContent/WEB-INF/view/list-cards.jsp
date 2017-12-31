<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html>
<html>
<head>
<title>Card List</title>
<link type="text/css" rel="stylesheet"
	href="${pageContext.request.contextPath}/resources/css/style.css" />
<%-- <link href="<c:url value='/resources/css/style.css' />" rel="stylesheet">
</head> --%>
<body>

	<div id="wrapper">
		<div id="header">
			<h2>Card List</h2>
		</div>
	</div>

	<div id="container">

		<!--  addlink with customer id -->
		<c:url var="addLink" value="/card/addForm">
			<c:param name="bundleId" value="${bundleId}"></c:param>
		</c:url>

		<!--  backToBundleLink with category id -->
		<c:url var="backToBundleLink" value="/card/back">
			<c:param name="bundleId" value="${bundleId}"></c:param>
		</c:url>

		<table>
			<tr>
				<th>Question</th>
				<th>Answer</th>
				<th>Reversable</th>
				<th>BundleId</th>
				<th><a href="${addLink}">Add new Card</a></th>
			</tr>

			<c:forEach var="card" items="${cards}">

				<!--  updatelink with category id -->
				<c:url var="updateLink" value="/card/updateForm">
					<c:param name="cardId" value="${card.id}"></c:param>
				</c:url>
				<!--  deletelink with category id -->
				<c:url var="deleteLink" value="/card/delete">
					<c:param name="cardId" value="${card.id}"></c:param>
					<c:param name="bundleId" value="${bundleId}"></c:param>
				</c:url>

				<tr>
					<td>${card.question}</td>
					<td>${card.answer}</td>
					<td>${card.reversable}</td>
					<td>${card.bundleId}</td>
					<td><a href="${updateLink}">Update</a> | <a
						href="${deleteLink}"
						onClick="if(!(confirm('Are you sure you want to delete this card?'))) return false">Delete</a></td>
				</tr>
			</c:forEach>
		</table>
		<a href="${backToBundleLink}">Back to Bundle</a>
	</div>
</body>
</html>