<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>

<!DOCTYPE html>
<html>
<head>
<title><c:choose>
		<c:when test="${card.id=='0'}">
					Create new Card
				</c:when>
		<c:otherwise>
					Update Card
				</c:otherwise>
	</c:choose></title>
<link type="text/css" rel="stylesheet"
	href="${pageContext.request.contextPath}/resources/css/style.css" />
<link type="text/css" rel="stylesheet"
	href="${pageContext.request.contextPath}/resources/css/add-customer-style.css" />
<%-- <link href="<c:url value='/resources/css/style.css' />" rel="stylesheet">
</head> --%>
<body>

	<!--  backToGroupsLink with category id -->
	<c:url var="backToGroupsLink" value="/card/show">
		<c:param name="bundleId" value="${card.bundleId}"></c:param>
	</c:url>

	<div id="wrapper">
		<div id="header">
			<c:choose>
				<c:when test="${card.id=='0'}">
					<h2>
						<a class="mybutton" href="${backToGroupsLink}">&#171; Back to
							List</a> Create new Card
					</h2>
				</c:when>
				<c:otherwise>
					<h2>
						<a class="mybutton" href="${backToGroupsLink}">&#171; Back to List</a> Update
						Card
					</h2>
				</c:otherwise>
			</c:choose>
		</div>
	</div>

	<div id="container">
		<form:form action="save" modelAttribute="card" method="POST">

			<!-- important, to map this customer to the right customer (while updating) -->
			<form:hidden path="id" />
			<form:hidden path="bundleId" />
			<%-- <form:hidden path="categoryId" /> --%>
			<%-- <input name="bundleId" type="hidden" value="${bundleId}" /> --%>

			<table>
				<tbody>
					<tr>
						<td><label>Question:</label></td>
						<td><form:input path="question" /></td>
					</tr>
					<tr>
						<td><label>Answer:</label></td>
						<td><form:input path="answer" /></td>
					</tr>
					<tr>
						<td><label>Reversable:</label></td>
						<td><form:checkbox path="reversable" /></td>
					</tr>
					<tr>
						<td><label></label></td>
						<td><input type="submit" value="Save" class="mybutton" /></td>
					</tr>
				</tbody>
			</table>
		</form:form>


		<form method="POST" enctype="multipart/form-data" action="uploadList">
			<input name="bundleId" type="hidden" value="${bundleId}" />
			<table>
				<tr>
					<td>Upload a List:</td>
				</tr>
				<tr>
					<td>File to upload:</td>
					<td><input type="file" name="file" /></td>
				</tr>
				<tr>
					<td></td>
					<td><input type="submit" value="Upload" class="mybutton" /></td>
				</tr>
			</table>
		</form>
	</div>

</body>
</html>