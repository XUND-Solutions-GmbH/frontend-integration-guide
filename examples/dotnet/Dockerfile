FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY src/FrontendIntegrationDemo.csproj ./
RUN dotnet restore FrontendIntegrationDemo.csproj
COPY src/ ./
RUN dotnet publish FrontendIntegrationDemo.csproj -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish ./
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "FrontendIntegrationDemo.dll"]

