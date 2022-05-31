global with sharing class SfGpsDsGetManagedContentCollectionORA implements Callable {
  final static String DEFAULT_LANGUAGE = 'es_US';
  final static Integer DEFAULT_PAGE_PARAM = 0;
  final static Integer DEFAULT_PAGE_SIZE = 25;
  final static Boolean DEFAULT_FULL_URL = false;

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

      ConnectApi.ManagedContentVersionCollection coll = ConnectApi.ManagedContent.getManagedContentByContentKeys(
        input.communityId,
        input.contentKeys,
        options.pageParam == null ? DEFAULT_PAGE_PARAM : options.pageParam,
        options.pageSize == null ? DEFAULT_PAGE_SIZE : options.pageSize,
        input.language == null ? DEFAULT_LANGUAGE : input.language,
        input.managedContentType,
        options.fullUrl == null ? DEFAULT_FULL_URL : options.fullUrl
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
      this.language = DEFAULT_LANGUAGE;
    }
  }

  public class GetManagedContentCollectionOptions {
    public Integer pageParam;
    public Integer pageSize;
    public Boolean fullUrl;

    public GetManagedContentCollectionOptions() {
      this.pageParam = DEFAULT_PAGE_PARAM;
      this.pageSize = DEFAULT_PAGE_SIZE;
      this.fullUrl = DEFAULT_FULL_URL;
    }
  }

  public class MalformedCallException extends Exception {
  }
}
