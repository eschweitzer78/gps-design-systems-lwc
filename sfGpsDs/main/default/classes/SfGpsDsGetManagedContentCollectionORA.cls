global with sharing class SfGpsDsGetManagedContentCollectionORA implements Callable {
  global Object call(String action, map<String, Object> args) {
    switch on action {
      when 'GetManagedContentCollection' {
        getManagedContentCollection(
          (Map<String, Object>) args.get('input'),
          (Map<String, Object>) args.get('output'),
          (Map<String, Object>) args.get('options')
        );
        return args;
      }
      when else {
        throw new MalformedCallException('Method not implemented');
      }
    }
  }

  void getManagedContentCollection(
    Map<String, Object> inputMap,
    Map<String, Object> outputMap,
    Map<String, Object> optionsMap
  ) {
    try {
      GetManagedContentCollectionInput input = (GetManagedContentCollectionInput) JSON.deserialize(
        JSON.serialize(inputMap),
        getManagedContentCollectionInput.class
      );

      GetManagedContentCollectionOptions options = (GetManagedContentCollectionOptions) JSON.deserialize(
        JSON.serialize(optionsMap),
        getManagedContentCollectionOptions.class
      );

      if (input == null) {
        input = new GetManagedContentCollectionInput();
      }
      if (options == null) {
        options = new GetManagedContentCollectionOptions();
      }
      /*      
      if (options.pageParam == null) { options.pageParam = 0; }
      if (options.pagesize == null) { options.pageSize = 25; }
      if (options.fullUrl == null) { options.fullUrl = false; }
      */

      ConnectApi.ManagedContentVersionCollection coll = ConnectApi.ManagedContent.getManagedContentByContentKeys(
        input.communityId,
        input.contentKeys,
        options.pageParam,
        options.pageSize,
        input.language,
        input.managedContentType,
        options.fullUrl
      );

      /* for some funny reason an OmniStudio Transform DR will fail if the data is returned as above */
      String js = JSON.serialize(coll);
      Object neutralCollection = JSON.deserializeUntyped(js);

      outputMap.put('collection', neutralCollection);
      outputMap.put('hasError', false);
    } catch (Exception e) {
      outputMap.put('hasError', true);
      outputMap.put('errorMessage', e.getMessage());
    }
  }

  public class GetManagedContentCollectionInput {
    public String communityId;
    public String managedContentType;
    public List<String> contentKeys;
    public String language;

    public GetManagedContentCollectionInput() {
      this.language = 'es_US';
    }
  }

  public class GetManagedContentCollectionOptions {
    public Integer pageParam;
    public Integer pageSize;
    public Boolean fullUrl;

    public GetManagedContentCollectionOptions() {
      this.pageParam = 0;
      this.pageSize = 25;
      this.fullUrl = false;
    }
  }

  public class MalformedCallException extends Exception {
  }
}
