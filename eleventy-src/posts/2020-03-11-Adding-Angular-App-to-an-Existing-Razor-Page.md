---
title: Adding Angular Components to an Existing Razor Page in an ASP.Net Core App
tags: 
  - csharp
  - technical
---

> **Update (Mar 17, 2020):** I found out that you can use the tag helper [srcInclude](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.mvc.taghelpers.scripttaghelper.srcinclude?view=aspnetcore-3.1#Microsoft_AspNetCore_Mvc_TagHelpers_ScriptTagHelper_SrcInclude) that enables you to use glob patterns such as this: `<script asp-src-include"~/app.*.js"></script>`. Hence, my lengthy hacky way below is unnecessary unless you're deploying hashed assets to a CDN.

<!-- omit in toc -->
# Content
- [TL;DR](#tl%3Bdr)
- [Introduction](#introduction)
- [Alternative Approaches](#alternative-approaches)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
  - [Add a standard Angular Project with Angular CLI](#add-a-standard-angular-project-with-angular-cli)
  - [Update `package.json` Scripts to Add the Correct Deploy URL](#update-package.json-scripts-to-add-the-correct-deploy-url)
  - [Add a @RenderSection in _Layout.cshtml to Inject Stylesheets](#add-a-%40rendersection-in-_layout.cshtml-to-inject-stylesheets)
  - [Add Partial Razor Templates to inject Assets in Development Environment](#add-partial-razor-templates-to-inject-assets-in-development-environment)
  - [Create a Script to Generate Razor Partials for Production Assets](#create-a-script-to-generate-razor-partials-for-production-assets)
  - [Edit your PROJECT.csproj File to Configure Required Tasks for Publishing Angular Assets](#edit-your-project.csproj-file-to-configure-required-tasks-for-publishing-angular-assets)
  - [Edit Your Startup File to Include Angular Assets in Production Mode and Enable Hot Reloading in Development Mode](#edit-your-startup-file-to-include-angular-assets-in-production-mode-and-enable-hot-reloading-in-development-mode)
  - [Final Step: Add Angular Components into a Razor Page](#final-step%3A-add-angular-components-into-a-razor-page)

# TL;DR

I describe my approach for adding Angular components in Razor pages in an Asp.Net project. My approach supports both live-reloading for Development mode and publishing hashed assets for production builds. A project example can be [viewed here](https://github.com/AlahmadiQ8/RazorPagesAngular).

# Introduction

Asp.net Core offers a variety of project templates to get started with. For web applications, in addition to MVC and Razor Pages templates, it also offers templates for frontend single-page applications with integration into asp.net core app. 

Currently, the Angular template comes bundled with client-side routing and the backend is set up to delegate all routing to the frontend. 

In my particular case, I just wanted to add simple Angular components on Razor pages without any client-side routing. I searched online for a solution but couldn’t find one that satisfied my requirements. 

In this post, I will my approach to add angular components to Razor pages. My approach has its flaws. So if you can think of an improvement, please share your feedback. 

# Alternative Approaches
- [Add angular apps to existing dot net core project](https://www.dotnetfocus.com/add-multiple-angular-7-apps-to-existing-dot-net-core-project/): My post is largely inspired by this post. The author makes innovative use of tag helpers to inject Angular assets into a Razor page. They use a web scraping library to extract the Angular assets from Angular-generated `index.html`. The method is more foolproof and not brittle unlike my method of using a shell script. Still, it does not support live server reloading.
- [Add The latest Angular CLI project(7.x) to ASP.Net Core 2.1 project](https://medium.com/@frankchen2016/add-the-latest-angular-cli-project-to-asp-net-core-2-1-project-dc9205285b97): A very simple and straightforward approach by simply hardcoding Angular assets into a Razor. The downside is that you cannot use it with hashed assets without having to manually hardcode them every time new hashes are generated. 
# Problem Statement

I want to set up an Angular project such that you can add angular components to Razor pages with no client-side routine. The setup must satisfy the same development experience the official angular template supports. Specifically, the setup must support local development with live reloading. 

# Solution


## Add a standard Angular Project with Angular CLI

Navigate to your asp.net project directory and create an angular app using Angular CLI:


```bash
ng new ClientApp
```

You’d be prompted if you wanna use routing, make sure you choose no.

Your project directory would look something like this:

```bash
├── ClientApp
├── Pages
├── Program.cs
├── Properties
├── RazorPagesAngular.csproj
├── Startup.cs
├── appsettings.Development.json
├── appsettings.json
├── bin
├── obj
└── wwwroot
```


## Update `package.json` Scripts to Add the Correct Deploy URL

Update the `start` and `build` scripts in `package.json` as follows:

```json
    "start": "ng serve --deployUrl=/ClientApp/dist/",
    "build": "ng build --deployUrl=/ClientApp/dist/",
```


> You can also update your `angular.json` file to setup the above config as shown [here](https://github.com/AlahmadiQ8/RazorPagesAngular/blob/master/ClientApp/angular.json#L25)


## Add a @RenderSection in _Layout.cshtml to Inject Stylesheets


> See Final [_Layout.cshtml](https://github.com/AlahmadiQ8/RazorPagesAngular/blob/master/Pages/Shared/_Layout.cshtml)

The razor template already includes a section for injecting addition javascript assets as shown below: 

```html
@RenderSection("Scripts", required: false)
```

However, you also need another section to inject the Angular generated stylesheets. Navigate to `_Layout.cshtml` file and update the `<head>` section as shown below:

```html
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>@ViewData["Title"] - Skinshare.Web</title>
  <link rel="stylesheet" href="~/lib/bootstrap/dist/css/bootstrap.min.css" />
  <link rel="stylesheet" href="~/css/site.css" />
  @* A section to include angular generated stylesheets *@
  @RenderSection("StyleSheets", required: false) 
</head>
```

## Add Partial Razor Templates to inject Assets in Development Environment


> See final [_AppStyleSheets.cshtml](https://github.com/AlahmadiQ8/RazorPagesAngular/blob/master/Pages/Shared/_AppStyleSheets.cshtml) and [_AppScripts.cshtml](https://github.com/AlahmadiQ8/RazorPagesAngular/blob/master/Pages/Shared/_AppScripts.cshtml).

Create partial razor templates to inject the javascript and stylesheet assets into the razor page where the Angular component would be used. 

You need two partial templates, one for adding javascript assets and one for adding stylesheets. These will inject Angular scripts and stylesheets during *the Development environment only*. 

```bash
Pages
└── Shared
    ├── _AppScripts.cshtml
    ├── _AppStyleSheets.cshtml
    ├── _Layout.cshtml
    └── _ValidationScriptsPartial.cshtml
```

```html
@* _AppScripts.cshtml *@
<script src="/ClientApp/dist/runtime.js" type="module"></script>
<script src="/ClientApp/dist/polyfills.js" type="module"></script>
<script src="/ClientApp/dist/vendor.js" type="module"></script>
<script src="/ClientApp/dist/main.js" type="module"></script>
```

```html
@* _AppStyleSheets.cshtml *@
<link rel="stylesheet" href="/ClientApp/diststyles.css">
```


## Create a Script to Generate Razor Partials for Production Assets

Adding development scripts is straightforward because when running Angular in development mode,  The assets’ file names never change (i.e they’re always `runtime.js`, `polyfills.js`, etc). However, production assets are hashed on each new build. Therefore, They cannot be hardcoded as done in the previous section. Another challenge is figuring out the correct load order of production js assets. The only source of truth for the order is inspecting the generated `index.html` file by the `ng build` command. 

I wrote a **very brittle** shell script to scrape the assets from the generated `index.html` and creates addition razor templates to inject production assets. Copy the script below and paste it in `<root_project_dir>/scripts/generate-clientapp-assets.zsh`: 

```bash
#!/usr/bin/env zsh

pathToIndex="ClientApp/dist/index.html";
# Finds the line that contains the stylesheets
lineToStyleSheets=$(awk '/stylesheet/{ print NR; exit }' $pathToIndex );  # DANGER Super Brittle
# Finds the line that contains the js scripts
lineToScripts=$(awk '/script/{ print NR; exit }' $pathToIndex );          # DANGER Super Brittle
pathToPartials="Pages/Shared"

styleSheets=$(sed "${lineToStyleSheets}q;d" $pathToIndex);
styleSheets=$(echo $styleSheets | sed 's/<\/head>//g' );
scripts=$(sed "${lineToScripts}q;d" $pathToIndex);
scripts=$(echo $scripts | sed 's/<\/body>//g' );

echo $styleSheets > "$pathToPartials/_AppStyleSheetsProd.cshtml";
echo $scripts > "$pathToPartials/_AppScriptsProd.cshtml"
echo "Created prod prartials for _AppStyleSheetsProd.cshtml & _AppScriptsProd.cshtml";
```

The script does the following:

- Grabs the line in `index.html` that contains the stylesheets and copies it to `Pages/Shared/_AppStyleSheetsProd.cshtml`.
- Grabs the line in `index.html` that contains the javascript assets and copies it to `Pages/Shared/_AppScriptsProd.cshtml`


> Don’t forget to add execute permissions to the script by running `chmod +x scripts/generate-clientapp-assets.zsh`

Here is how your `Pages/Shared` directory looks like after executing the script

```bash
Pages
└── Shared
   ├── _AppScripts.cshtml
   ├── _AppScriptsProd.cshtml
   ├── _AppStyleSheets.cshtml
   ├── _AppStyleSheetsProd.cshtml
   ├── _Layout.cshtml
   └── _ValidationScriptsPartial.cshtml
```


## Edit your PROJECT.csproj File to Configure Required Tasks for Publishing Angular Assets

My csproj file is based on the one generated by dotnet angular template. I added an additional task `CopyPartials` shown below to copy production assets into razor partials. The file can be viewed [here](https://github.com/AlahmadiQ8/RazorPagesAngular/blob/master/RazorPagesAngular.csproj). 

```xml
<Target Name="CopyPartials" BeforeTargets="Compile" DependsOnTargets="BuildAsset" Condition=" '$(Configuration)' == 'Release' ">
  <!-- Generate new _AppScriptsProd.cshtml and _AppStyleSheetsProd.cshtml based on the freshly created production build -->
  <Exec Command="source scripts/generate-clientapp-assets.zsh" />
</Target>
```


## Edit Your Startup File to Include Angular Assets in Production Mode and Enable Hot Reloading in Development Mode


> The final Startup.cs looks like [this](https://github.com/AlahmadiQ8/RazorPagesAngular/blob/master/RazorPagesAngular.csproj)


- Right below `app.UseStaticFiles();` insert the following:
  
```csharp
if (!env.IsDevelopment())
{
  app.UseStaticFiles(new StaticFileOptions
  {
    FileProvider = new PhysicalFileProvider(
    Path.Combine(Directory.GetCurrentDirectory(), "ClientApp/dist")),
    RequestPath = "/ClientApp/dist"
  });
}
```

- Right below `app.UseEndpoints` invocation, insert the following: 
- 
```csharp
if (env.IsDevelopment())
{
  app.UseSpa(spa =>
  {
    spa.Options.SourcePath = null;
    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
  });
}
```


## Final Step: Add Angular Components into a Razor Page

Now that we’re don’t with all the setup, here is how I add my components: 

```html
@page
@model Skinshare.Web.Pages.Routines.CreateModel
@{
  ViewData["Title"] = "Angular Component Example";
}
<!-- An angular component -->
<app-root></app-root>

@section StyleSheets {
  <environment include="Development">
    @{await Html.RenderPartialAsync("_AppStyleSheets");}
  </environment>
  <environment exclude="Development">
    @{await Html.RenderPartialAsync("_AppStyleSheetsProd");}
  </environment>
}

@section Scripts {
  <environment include="Development">
    @{await Html.RenderPartialAsync("_AppScripts");}
  </environment>
  <environment exclude="Development">
    @{await Html.RenderPartialAsync("_AppScriptsProd");}
  </environment>

  @{await Html.RenderPartialAsync("_ValidationScriptsPartial");}
}
```
    

For development mode, in a separate terminal, navigate to `/ClientApp` and run `npm start`. Then run your Dotnet app in development mode. 

When you publish your app, the MS Build Task `CopyPartials` will run right after production Angular assets are generated and before the Dotnet project is compiled. This will ensure that the production assets are injected using the `_AppScriptsProd.cshtml` and `_AppStyleSheetsProd.cshtml` partials. 

