---
title: Snippets - Creating Customer Json Property Naming Policies in ASP.Net Core
tags: 
  - csharp
  - technical
  - snippets
---

As of .Net Core 3.0, the default json serializer is from `System.Text.Json` using   `JsonSerializer.Serialize` . The default behavior for serializing property names is use the object property name. To use camel case, you’d use the builtin policy `JsonNamingPolicy` we showing below

```csharp
var jsonSerializerOptions = new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    WriteIndented = true
};
var result = JsonSerializer.Serialize<TodoItem>(todo, jsonSerializerOptions);
```

The [official docs](https://docs.microsoft.com/en-us/dotnet/standard/serialization/system-text-json-how-to#customize-json-names-and-values) goes more detail on custom property naming. 

If you were to implement your own property naming policy, all you need to do is implement the abstract class `JsonNamingPolicy` and implement the abstract method `ConvertName`. Here is an example: 

```csharp
public class MyCustomPropertyNameingJsonPolicy : JsonNamingPolicy
{
    public override string ConvertName(string name)
    {
        // Do something with the string
        return name.ToUpper();
    }
}
```

Here is how you’d use it: 

```csharp
serializerOptions = new JsonSerializerOptions
{
    PropertyNamingPolicy = new LowerCamelCaseJsonPolicy()
};
```
